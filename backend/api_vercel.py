from fastapi import FastAPI, Request
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
import os

app = FastAPI(title="BoneHealth AI API", version="1.0.0")

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

@app.get("/")
async def root():
    return {
        "message": "BoneHealth AI Backend API",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs",
        "health": "/health"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "bonehealth-ai-backend"}

@app.post("/api/predict")
async def predict(request: Request):
    try:
        data = await request.json()
        
        # For Vercel deployment, we'll use a smaller dataset or generate synthetic data
        # since we can't rely on file system access in serverless environment
        
        # Create synthetic data for demonstration
        np.random.seed(42)
        n_samples = 1000
        
        # Generate synthetic osteoporosis dataset
        ages = np.random.normal(60, 15, n_samples).astype(int)
        ages = np.clip(ages, 18, 90)
        
        genders = np.random.choice(['Male', 'Female'], n_samples)
        hormonal_changes = np.random.choice(['Normal', 'Postmenopausal'], n_samples)
        family_history = np.random.choice(['No', 'Yes'], n_samples, p=[0.7, 0.3])
        race_ethnicity = np.random.choice(['White', 'Asian', 'Hispanic', 'Black', 'Other'], n_samples)
        body_weight = np.random.choice(['Normal', 'Underweight', 'Overweight'], n_samples)
        calcium_intake = np.random.choice(['Adequate', 'Low'], n_samples)
        vitamin_d_intake = np.random.choice(['Sufficient', 'Insufficient'], n_samples)
        physical_activity = np.random.choice(['Active', 'Sedentary'], n_samples)
        smoking = np.random.choice(['No', 'Yes'], n_samples, p=[0.8, 0.2])
        alcohol_consumption = np.random.choice(['None', 'Moderate', 'Heavy'], n_samples)
        medical_conditions = np.random.choice(['None', 'Rheumatoid Arthritis', 'Hyperthyroidism'], n_samples)
        medications = np.random.choice(['None', 'Corticosteroids'], n_samples, p=[0.8, 0.2])
        prior_fractures = np.random.choice(['No', 'Yes'], n_samples, p=[0.7, 0.3])
        
        # Create target variable based on risk factors
        osteoporosis_risk = (
            (ages > 65).astype(int) * 0.3 +
            (genders == 'Female').astype(int) * 0.2 +
            (hormonal_changes == 'Postmenopausal').astype(int) * 0.2 +
            (family_history == 'Yes').astype(int) * 0.15 +
            (body_weight == 'Underweight').astype(int) * 0.1 +
            (calcium_intake == 'Low').astype(int) * 0.1 +
            (vitamin_d_intake == 'Insufficient').astype(int) * 0.1 +
            (physical_activity == 'Sedentary').astype(int) * 0.1 +
            (smoking == 'Yes').astype(int) * 0.1 +
            (alcohol_consumption == 'Heavy').astype(int) * 0.1 +
            (medical_conditions != 'None').astype(int) * 0.15 +
            (medications == 'Corticosteroids').astype(int) * 0.2 +
            (prior_fractures == 'Yes').astype(int) * 0.2
        )
        
        # Add some randomness
        osteoporosis_risk += np.random.normal(0, 0.1, n_samples)
        osteoporosis = (osteoporosis_risk > 0.5).astype(int)
        
        # Create DataFrame
        df = pd.DataFrame({
            'Age': ages,
            'Gender': genders,
            'Hormonal Changes': hormonal_changes,
            'Family History': family_history,
            'Race/Ethnicity': race_ethnicity,
            'Body Weight': body_weight,
            'Calcium Intake': calcium_intake,
            'Vitamin D Intake': vitamin_d_intake,
            'Physical Activity': physical_activity,
            'Smoking': smoking,
            'Alcohol Consumption': alcohol_consumption,
            'Medical Conditions': medical_conditions,
            'Medications': medications,
            'Prior Fractures': prior_fractures,
            'Osteoporosis': osteoporosis
        })
        
        # Prepare features
        X = df.drop(columns=["Osteoporosis"])
        y = df["Osteoporosis"]
        
        # One-hot encode categorical variables
        X = pd.get_dummies(X)
        
        # Train model
        base_clf = RandomForestClassifier(n_estimators=100, random_state=42)
        base_clf.fit(X, y)
        
        # Prepare input for prediction
        input_df = pd.DataFrame([data])
        input_df = pd.get_dummies(input_df)
        
        # Align columns with training data
        input_df = input_df.reindex(columns=X.columns, fill_value=0)
        
        # Predict probability
        proba = base_clf.predict_proba(input_df)[0][1]
        
        # SHAP analysis
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
        
        # Get top contributing factors
        abs_shap = np.abs(shap_arr)
        top_idx = np.argsort(abs_shap)[::-1][:3]
        
        contributing_factors = []
        for i in top_idx:
            if i < len(input_df.columns):
                feature = input_df.columns[i]
                contributing_factors.append({
                    "feature": feature,
                    "shap": float(shap_arr[i])
                })
        
        return {
            "probability": float(proba),
            "contributing_factors": contributing_factors,
            "deployment": "vercel-serverless"
        }
        
    except Exception as e:
        return {"error": str(e), "deployment": "vercel-serverless"}

@app.get("/api/data-science-metrics")
def get_data_science_metrics():
    try:
        # Generate synthetic data for metrics
        np.random.seed(42)
        n_samples = 1000
        
        # Generate features (same as in predict function)
        ages = np.random.normal(60, 15, n_samples).astype(int)
        ages = np.clip(ages, 18, 90)
        
        genders = np.random.choice(['Male', 'Female'], n_samples)
        hormonal_changes = np.random.choice(['Normal', 'Postmenopausal'], n_samples)
        family_history = np.random.choice(['No', 'Yes'], n_samples, p=[0.7, 0.3])
        race_ethnicity = np.random.choice(['White', 'Asian', 'Hispanic', 'Black', 'Other'], n_samples)
        body_weight = np.random.choice(['Normal', 'Underweight', 'Overweight'], n_samples)
        calcium_intake = np.random.choice(['Adequate', 'Low'], n_samples)
        vitamin_d_intake = np.random.choice(['Sufficient', 'Insufficient'], n_samples)
        physical_activity = np.random.choice(['Active', 'Sedentary'], n_samples)
        smoking = np.random.choice(['No', 'Yes'], n_samples, p=[0.8, 0.2])
        alcohol_consumption = np.random.choice(['None', 'Moderate', 'Heavy'], n_samples)
        medical_conditions = np.random.choice(['None', 'Rheumatoid Arthritis', 'Hyperthyroidism'], n_samples)
        medications = np.random.choice(['None', 'Corticosteroids'], n_samples, p=[0.8, 0.2])
        prior_fractures = np.random.choice(['No', 'Yes'], n_samples, p=[0.7, 0.3])
        
        # Create target variable
        osteoporosis_risk = (
            (ages > 65).astype(int) * 0.3 +
            (genders == 'Female').astype(int) * 0.2 +
            (hormonal_changes == 'Postmenopausal').astype(int) * 0.2 +
            (family_history == 'Yes').astype(int) * 0.15 +
            (body_weight == 'Underweight').astype(int) * 0.1 +
            (calcium_intake == 'Low').astype(int) * 0.1 +
            (vitamin_d_intake == 'Insufficient').astype(int) * 0.1 +
            (physical_activity == 'Sedentary').astype(int) * 0.1 +
            (smoking == 'Yes').astype(int) * 0.1 +
            (alcohol_consumption == 'Heavy').astype(int) * 0.1 +
            (medical_conditions != 'None').astype(int) * 0.15 +
            (medications == 'Corticosteroids').astype(int) * 0.2 +
            (prior_fractures == 'Yes').astype(int) * 0.2
        )
        
        osteoporosis_risk += np.random.normal(0, 0.1, n_samples)
        osteoporosis = (osteoporosis_risk > 0.5).astype(int)
        
        df = pd.DataFrame({
            'Age': ages,
            'Gender': genders,
            'Hormonal Changes': hormonal_changes,
            'Family History': family_history,
            'Race/Ethnicity': race_ethnicity,
            'Body Weight': body_weight,
            'Calcium Intake': calcium_intake,
            'Vitamin D Intake': vitamin_d_intake,
            'Physical Activity': physical_activity,
            'Smoking': smoking,
            'Alcohol Consumption': alcohol_consumption,
            'Medical Conditions': medical_conditions,
            'Medications': medications,
            'Prior Fractures': prior_fractures,
            'Osteoporosis': osteoporosis
        })
        
        X = df.drop(columns=["Osteoporosis"])
        y = df["Osteoporosis"]
        X = pd.get_dummies(X)
        
        # Train/test split
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
            "accuracy": {"mean": float(np.mean(accuracy)), "std": float(np.std(accuracy))},
            "f1": {"mean": float(np.mean(f1)), "std": float(np.std(f1))},
            "recall": {"mean": float(np.mean(recall)), "std": float(np.std(recall))},
            "precision": {"mean": float(np.mean(precision)), "std": float(np.std(precision))},
            "roc_auc": {"mean": float(np.mean(roc_auc)), "std": float(np.std(roc_auc))}
        }
        
        # Feature importance
        feature_importance = sorted(
            [{"feature": f, "importance": float(imp)} for f, imp in zip(X.columns, clf.feature_importances_)],
            key=lambda x: x["importance"], reverse=True
        )[:5]
        
        return {
            "metrics": metrics,
            "feature_importance": feature_importance,
            "deployment": "vercel-serverless",
            "dataset_size": len(df)
        }
        
    except Exception as e:
        return {"error": str(e), "deployment": "vercel-serverless"}

# For Vercel serverless deployment
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 