from fastapi import  Request, APIRouter
from pydantic import BaseModel
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import cross_val_score, train_test_split
from sklearn.metrics import recall_score, f1_score, roc_auc_score, precision_score
import shap
import numpy as np
from fastapi.middleware.cors import CORSMiddleware
from sklearn.utils import resample
import random
from sklearn.calibration import CalibratedClassifierCV

router = APIRouter()

class PredictRequest(BaseModel):
    Age: int
    Gender: str
    Hormonal_Changes: str
    Family_History: str
    Race_Ethnicity: str
    Body_Weight: str
    Calcium_Intake: str
    Vitamin_D_Intake: str
    Physical_Activity: str
    Smoking: str
    Alcohol_Consumption: str
    Medical_Conditions: str
    Medications: str
    Prior_Fractures: str

@router.post("/predict")
async def predict(request: Request):
    try:
        data = await request.json()
        # Load data
        df = pd.read_csv("./data/osteoporosis.csv")
        # Synthetically generate nuanced negative cases for demo if needed
        if (df["Osteoporosis"] == 0).sum() < 10:
            n = min(500, len(df))
            df_pos = df[df["Osteoporosis"] == 1].sample(n, random_state=42, replace=True)
            negs = []
            for i, row in df_pos.iterrows():
                r = row.copy()
                p = random.random()
                if p < 0.6:  # 60% low risk
                    r["Age"] = random.randint(18, 40)
                    r["Gender"] = "Male"
                    r["Hormonal Changes"] = "Normal"
                    r["Family History"] = "No"
                    r["Body Weight"] = "Normal"
                    r["Calcium Intake"] = "Adequate"
                    r["Vitamin D Intake"] = "Sufficient"
                    r["Physical Activity"] = "Active"
                    r["Smoking"] = "No"
                    r["Alcohol Consumption"] = "None"
                    r["Medical Conditions"] = "None"
                    r["Medications"] = "None"
                    r["Prior Fractures"] = "No"
                elif p < 0.9:  # 30% moderate risk
                    r["Age"] = random.randint(41, 60)
                    r["Gender"] = random.choice(["Male", "Female"])
                    r["Hormonal Changes"] = random.choice(["Normal", "Postmenopausal"])
                    r["Family History"] = random.choice(["No", "Yes"])
                    r["Body Weight"] = random.choice(["Normal", "Underweight"])
                    r["Calcium Intake"] = random.choice(["Adequate", "Low"])
                    r["Vitamin D Intake"] = random.choice(["Sufficient", "Insufficient"])
                    r["Physical Activity"] = random.choice(["Active", "Sedentary"])
                    r["Smoking"] = random.choice(["No", "Yes"])
                    r["Alcohol Consumption"] = random.choice(["None", "Moderate"])
                    r["Medical Conditions"] = random.choice(["None", "Rheumatoid Arthritis", "Hyperthyroidism"])
                    r["Medications"] = random.choice(["None", "Corticosteroids"])
                    r["Prior Fractures"] = random.choice(["No", "Yes"])
                else:  # 10% borderline
                    r["Age"] = random.randint(61, 75)
                    r["Gender"] = random.choice(["Male", "Female"])
                    r["Hormonal Changes"] = random.choice(["Normal", "Postmenopausal"])
                    r["Family History"] = random.choice(["No", "Yes"])
                    r["Body Weight"] = random.choice(["Normal", "Underweight"])
                    r["Calcium Intake"] = random.choice(["Adequate", "Low"])
                    r["Vitamin D Intake"] = random.choice(["Sufficient", "Insufficient"])
                    r["Physical Activity"] = random.choice(["Active", "Sedentary"])
                    r["Smoking"] = random.choice(["No", "Yes"])
                    r["Alcohol Consumption"] = random.choice(["None", "Moderate"])
                    r["Medical Conditions"] = random.choice(["None", "Rheumatoid Arthritis", "Hyperthyroidism"])
                    r["Medications"] = random.choice(["None", "Corticosteroids"])
                    r["Prior Fractures"] = random.choice(["No", "Yes"])
                r["Osteoporosis"] = 0
                negs.append(r)
            df_neg = pd.DataFrame(negs)
            df = pd.concat([df, df_neg], axis=0).reset_index(drop=True)
        # Balance classes
        df_majority = df[df.Osteoporosis == 1]
        df_minority = df[df.Osteoporosis == 0]
        if len(df_minority) > 0:
            df_minority_upsampled = resample(
                df_minority,
                replace=True,
                n_samples=len(df_majority),
                random_state=42
            )
            df_balanced = pd.concat([df_majority, df_minority_upsampled], axis=0)
            df_balanced = df_balanced.sample(frac=1, random_state=42)
        else:
            df_balanced = df
        X = df_balanced.drop(columns=["Osteoporosis"])
        y = df_balanced["Osteoporosis"]
        # Remove Id column if present
        if 'Id' in X.columns:
            X = X.drop(columns=['Id'])
        X = pd.get_dummies(X)
        # Train calibrated model
        from sklearn.ensemble import RandomForestClassifier
        base_clf = RandomForestClassifier(n_estimators=100, random_state=42)
        base_clf.fit(X, y)
        clf = CalibratedClassifierCV(base_clf, cv=3, method="isotonic")
        clf.fit(X, y)
        # Prepare input for prediction
        input_df = pd.DataFrame([data])
        # Remove Id column if present
        if 'Id' in input_df.columns:
            input_df = input_df.drop(columns=['Id'])
        input_df = pd.get_dummies(input_df)
        # Align columns with training data
        input_df = input_df.reindex(columns=X.columns, fill_value=0)
        # Check column alignment
        if list(input_df.columns) != list(X.columns):
            return {
                "error": "input_df columns do not match training columns after reindexing.",
                "input_df_columns": list(input_df.columns),
                "training_columns": list(X.columns),
                "input_df_shape": input_df.shape,
                "X_shape": X.shape
            }
        # Predict probability
        proba = clf.predict_proba(input_df)[0][1]
        # SHAP analysis for this patient (as before)
        import shap
        explainer = shap.TreeExplainer(base_clf)
        shap_values = explainer.shap_values(input_df)
        if isinstance(shap_values, list):
            if len(shap_values) > 1:
                shap_arr = shap_values[1][0]
            else:
                shap_arr = shap_values[0][0]
        else:
            shap_arr = shap_values[0]
        shap_arr = np.ravel(shap_arr)
        # SHAPE CHECK: Ensure shap_arr and input_df.columns match
        if len(shap_arr) == 2 * len(input_df.columns):
            shap_arr = shap_arr[::2]  # Take every other value (corresponding to the 1 state)
        if len(shap_arr) != len(input_df.columns):
            return {
                "error": f"SHAP shape mismatch in /api/predict: shap_arr={len(shap_arr)}, columns={len(input_df.columns)}",
                "shap_arr_len": len(shap_arr),
                "columns_len": len(input_df.columns),
                "columns": list(input_df.columns),
                "shap_arr": shap_arr.tolist()
            }
        abs_shap = np.abs(shap_arr)
        top_idx = np.argsort(abs_shap)[::-1][:3]
        contributing_factors = []
        one_hot_prefixes = [
            "Gender_", "Race/Ethnicity_", "Body Weight_", "Calcium Intake_", "Vitamin D Intake_", "Physical Activity_", "Smoking_", "Alcohol Consumption_", "Medical Conditions_", "Medications_", "Prior Fractures_"
        ]
        for i in top_idx:
            if i >= len(input_df.columns):
                continue
            feature = input_df.columns[i]
            value = input_df.iloc[0, i]
            if any(str(feature).startswith(prefix) for prefix in one_hot_prefixes):
                if value != 1:
                    continue
            contributing_factors.append({
                "feature": feature,
                "shap": float(shap_arr[i].item() if isinstance(shap_arr[i], np.ndarray) and shap_arr[i].size == 1 else shap_arr[i])
            })
        return {"probability": float(proba.item() if isinstance(proba, np.ndarray) and proba.size == 1 else proba), "contributing_factors": contributing_factors}
    except Exception as e:
        return {"error": str(e)}

@router.get("/data-science-metrics")
def get_data_science_metrics():
    try:
        # Load data
        df = pd.read_csv("./data/osteoporosis.csv")
        # Assume 'Osteoporosis' is the target column (adjust if needed)
        # Balance the classes for more realistic metrics
        df_majority = df[df.Osteoporosis == 1]
        df_minority = df[df.Osteoporosis == 0]
        if len(df_minority) > 0:
            df_minority_upsampled = resample(
                df_minority,
                replace=True,
                n_samples=len(df_majority),
                random_state=42
            )
            df_balanced = pd.concat([df_majority, df_minority_upsampled], axis=0)
            df_balanced = df_balanced.sample(frac=1, random_state=42)
        else:
            df_balanced = df

        X = df_balanced.drop(columns=["Osteoporosis"])
        y = df_balanced["Osteoporosis"]
        if 'Id' in X.columns:
            X = X.drop(columns=['Id'])
        X = pd.get_dummies(X)

        # Simple preprocessing: encode categoricals
        X = pd.get_dummies(X)

        # Train/test split for demonstration
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

        # Model
        clf = RandomForestClassifier(n_estimators=100, random_state=42)
        clf.fit(X_train, y_train)

        # Cross-validation metrics
        accuracy = cross_val_score(clf, X, y, cv=5, scoring='accuracy')
        f1 = cross_val_score(clf, X, y, cv=5, scoring='f1')
        recall = cross_val_score(clf, X, y, cv=5, scoring='recall')
        precision = cross_val_score(clf, X, y, cv=5, scoring='precision')
        roc_auc = cross_val_score(clf, X, y, cv=5, scoring='roc_auc')

        metrics = {
            "accuracy": {"mean": float(np.mean(accuracy).item() if isinstance(np.mean(accuracy), np.ndarray) and np.mean(accuracy).size == 1 else np.mean(accuracy)), "std": float(np.std(accuracy).item() if isinstance(np.std(accuracy), np.ndarray) and np.std(accuracy).size == 1 else np.std(accuracy))},
            "f1": {"mean": float(np.mean(f1).item() if isinstance(np.mean(f1), np.ndarray) and np.mean(f1).size == 1 else np.mean(f1)), "std": float(np.std(f1).item() if isinstance(np.std(f1), np.ndarray) and np.std(f1).size == 1 else np.std(f1))},
            "recall": {"mean": float(np.mean(recall).item() if isinstance(np.mean(recall), np.ndarray) and np.mean(recall).size == 1 else np.mean(recall)), "std": float(np.std(recall).item() if isinstance(np.std(recall), np.ndarray) and np.std(recall).size == 1 else np.std(recall))},
            "precision": {"mean": float(np.mean(precision).item() if isinstance(np.mean(precision), np.ndarray) and np.mean(precision).size == 1 else np.mean(precision)), "std": float(np.std(precision).item() if isinstance(np.std(precision), np.ndarray) and np.std(precision).size == 1 else np.std(precision))},
            "roc_auc": {"mean": float(np.mean(roc_auc).item() if isinstance(np.mean(roc_auc), np.ndarray) and np.mean(roc_auc).size == 1 else np.mean(roc_auc)), "std": float(np.std(roc_auc).item() if isinstance(np.std(roc_auc), np.ndarray) and np.std(roc_auc).size == 1 else np.std(roc_auc))}
        }

        # Probability distribution
        y_proba_raw = clf.predict_proba(X)
        if len(y_proba_raw.shape) == 1:
            # Only one class, fallback to zeros
            y_proba = np.zeros(X.shape[0])
        else:
            y_proba = y_proba_raw[:, 1]
        hist, bin_edges = np.histogram(y_proba, bins=10, range=(0, 1))
        prob_dist = {
            "hist": hist.tolist(),
            "bin_edges": bin_edges.tolist()
        }

        # SHAP feature importances
        explainer = shap.TreeExplainer(clf)
        shap_values = explainer.shap_values(X)
        # Ensure shape match for SHAP values and features
        if isinstance(shap_values, list):
            shap_arr = shap_values[1]
        else:
            shap_arr = shap_values
        # If SHAP array is double the number of columns, take every other value
        if shap_arr.shape[1] == 2 * len(X.columns):
            shap_arr = shap_arr[:, ::2]
        if shap_arr.shape[1] != len(X.columns):
            return {
                "error": f"SHAP shape mismatch: shap_arr.shape={shap_arr.shape}, X.columns={len(X.columns)}",
                "shap_shape": str(shap_arr.shape),
                "feature_count": len(X.columns),
                "feature_names": list(X.columns)
            }
        mean_abs_shap = np.abs(shap_arr).mean(axis=0)
        feature_importance = sorted(
            [{"feature": f, "importance": float(imp.item() if isinstance(imp, np.ndarray) and np.array(imp).size == 1 else imp)} for f, imp in zip(X.columns, mean_abs_shap)],
            key=lambda x: x["importance"], reverse=True
        )[:5]  # Top 5

        # SHAP dependence for Age (if present)
        shap_dependence = []
        if "Age" in X.columns:
            shap_dependence = [
                {"age": float(a.item() if isinstance(a, np.ndarray) and np.array(a).size == 1 else a), "shap": float(s.item() if isinstance(s, np.ndarray) and np.array(s).size == 1 else s)}
                for a, s in zip(X["Age"], shap_arr[:, X.columns.get_loc("Age")])
            ]

        # Partial dependence for Calcium Intake (if present)
        pdp = []
        if "Calcium Intake" in X.columns:
            calcium_vals = np.linspace(X["Calcium Intake"].min(), X["Calcium Intake"].max(), 10)
            for val in calcium_vals:
                X_temp = X.copy()
                X_temp["Calcium Intake"] = val
                preds = clf.predict_proba(X_temp)[:, 1]
                pdp.append({"calcium": float(val.item() if isinstance(val, np.ndarray) and np.array(val).size == 1 else val), "pred": float(np.mean(preds).item() if isinstance(np.mean(preds), np.ndarray) and np.mean(preds).size == 1 else np.mean(preds))})

        # New: Add y_proba, first patient risk, and first patient SHAP values
        first_patient_risk = float(y_proba[0].item() if isinstance(y_proba[0], np.ndarray) and np.array(y_proba[0]).size == 1 else y_proba[0]) if len(y_proba) > 0 else None
        # SHAP for first patient, with shape check
        if shap_arr.shape[1] == 2 * len(X.columns):
            first_patient_shap_arr = shap_arr[0][::2]
        else:
            first_patient_shap_arr = shap_arr[0]
        if len(first_patient_shap_arr) != len(X.columns):
            return {
                "error": f"SHAP shape mismatch (first patient): shap_arr={len(first_patient_shap_arr)}, X.columns={len(X.columns)}",
                "shap_arr_len": len(first_patient_shap_arr),
                "feature_count": len(X.columns),
                "feature_names": list(X.columns)
            }
        first_patient_shap = first_patient_shap_arr.tolist() if len(first_patient_shap_arr) > 0 else []
        first_patient_features = list(X.columns)
        # Add SHAP base value (expected value)
        shap_base_value = float(explainer.expected_value[1].item() if hasattr(explainer, 'expected_value') and isinstance(explainer.expected_value, (list, np.ndarray)) and np.array(explainer.expected_value[1]).size == 1 else explainer.expected_value[1]) if hasattr(explainer, 'expected_value') and isinstance(explainer.expected_value, (list, np.ndarray)) else float(explainer.expected_value.item() if isinstance(explainer.expected_value, np.ndarray) and explainer.expected_value.size == 1 else explainer.expected_value)

        return {
            "metrics": metrics,
            "prob_dist": prob_dist,
            "feature_importance": feature_importance,
            "shap_dependence": shap_dependence,
            "partial_dependence": pdp,
            "y_proba": y_proba.tolist(),
            "first_patient_risk": first_patient_risk,
            "first_patient_shap": first_patient_shap,
            "first_patient_features": first_patient_features,
            "shap_base_value": shap_base_value
        }
    except Exception as e:
        return {"error": str(e)} 