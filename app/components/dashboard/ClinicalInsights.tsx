import { usePrediction } from "./PredictionContext";
import { usePatientForm } from "./PatientFormContext";
import { FaHeartbeat, FaVial, FaUserMd } from "react-icons/fa";

function getFactorSentence(feature: string, value: string, shap: number): string {
  // Evidence-based, context-aware explanations
  if (feature === "Age") {
    const age = parseInt(value, 10);
    if (isNaN(age)) return "Age information is missing.";
    if (age < 40) return `At ${age}, age is not a significant risk factor for osteoporosis.`;
    if (age >= 65) return `At ${age}, age is a major risk factor for osteoporosis.`;
    if (age >= 50) return `At ${age}, age moderately increases your risk for osteoporosis.`;
    return `At ${age}, age is a minor risk factor for osteoporosis.`;
  }
  if (feature === "Gender") {
    if (value === "Female") return "Women are at higher risk for osteoporosis, especially after menopause.";
    if (value === "Male") return "Men are at lower risk than women, but risk increases with age.";
    return "Gender information is missing.";
  }
  if (feature === "Hormonal Changes") {
    if (value === "Postmenopausal") return "Postmenopausal status increases osteoporosis risk due to lower estrogen levels.";
    return "Normal hormone levels help protect your bones.";
  }
  if (feature === "Body Weight") {
    if (value === "Underweight") return "Low body weight is a significant risk factor for osteoporosis.";
    if (value === "Normal") return "Normal body weight helps protect your bones.";
    return "Body weight information is missing.";
  }
  if (feature === "Calcium Intake") {
    if (value === "Low") return "Low calcium intake increases your risk for osteoporosis.";
    if (value === "Adequate") return "Adequate calcium intake helps protect your bones.";
    return "Calcium intake information is missing.";
  }
  if (feature === "Physical Activity") {
    if (value === "Sedentary") return "Lack of physical activity increases your risk for osteoporosis.";
    if (value === "Active") return "Regular physical activity helps reduce your risk.";
    return "Physical activity information is missing.";
  }
  if (feature === "Smoking") {
    if (value === "Yes") return "Smoking increases your risk for osteoporosis.";
    if (value === "No") return "Not smoking helps protect your bones.";
    return "Smoking information is missing.";
  }
  if (feature === "Alcohol Consumption") {
    if (value === "Moderate") return "Moderate or high alcohol consumption increases your risk for osteoporosis.";
    if (value === "None") return "Not drinking alcohol helps protect your bones.";
    return "Alcohol consumption information is missing.";
  }
  if (feature === "Family History") {
    if (value === "Yes") return "A family history of osteoporosis increases your risk.";
    if (value === "No") return "No family history helps reduce your risk.";
    return "Family history information is missing.";
  }
  if (feature === "Prior Fractures") {
    if (value === "Yes") return "A history of prior fractures is a strong risk factor for osteoporosis.";
    if (value === "No") return "No prior fractures helps reduce your risk.";
    return "Fracture history information is missing.";
  }
  // Fallback: Only use SHAP sign for features where both directions are possible
  if (shap > 0) return `${feature}: Increases risk.`;
  return `${feature}: Decreases risk.`;
}

function getOverallSummary(riskPercent: number, riskLabel: string): string {
  if (riskPercent >= 70) {
    return `This patient is at HIGH risk for osteoporosis (${riskPercent}%). Immediate preventive action and further clinical evaluation are strongly recommended.`;
  } else if (riskPercent >= 30) {
    return `This patient is at MODERATE risk for osteoporosis (${riskPercent}%). Lifestyle changes and monitoring are advised.`;
  } else {
    return `This patient is at LOW risk for osteoporosis (${riskPercent}%). Continue healthy habits and regular checkups.`;
  }
}

export default function ClinicalInsights() {
  const { predictionData } = usePrediction();
  const { form } = usePatientForm();

  let riskPercent: number | null = null;
  let riskLabel = "";
  let riskColor = "";
  let icon = <FaHeartbeat className="text-blue-400 text-2xl sm:text-4xl lg:text-4xl" />;
  if (predictionData && typeof predictionData.probability === "number") {
    riskPercent = Math.round(predictionData.probability * 100);
    if (riskPercent >= 70) {
      riskLabel = "High Risk";
      riskColor = "text-red-600";
      icon = <FaHeartbeat className="text-red-500 text-2xl sm:text-4xl lg:text-4xl animate-pulse" />;
    } else if (riskPercent >= 30) {
      riskLabel = "Moderate Risk";
      riskColor = "text-yellow-600";
      icon = <FaVial className="text-yellow-500 text-2xl sm:text-4xl lg:text-4xl" />;
    } else {
      riskLabel = "Low Risk";
      riskColor = "text-green-600";
      icon = <FaUserMd className="text-green-500 text-2xl sm:text-4xl lg:text-4xl" />;
    }
  }

  if (riskPercent === null) {
    return null;
  }

  // Dynamic clinical insights
  let insights: string[] = [];
  if (Array.isArray(predictionData?.contributing_factors) && predictionData.contributing_factors.length > 0) {
    // Sort by absolute SHAP value, descending
    const sorted = [...predictionData.contributing_factors].sort((a, b) => Math.abs(b.shap) - Math.abs(a.shap));
    insights = sorted.map((factor: { feature: string; shap: number }) => {
      const value = form[factor.feature] || "";
      return getFactorSentence(factor.feature, value, factor.shap);
    });
  }

  // Overall summary at the top
  const overallSummary = getOverallSummary(riskPercent, riskLabel);

  return (
    <div className="w-full lg:flex lg:justify-center lg:items-center lg:min-h-[60vh] bg-gradient-to-br from-blue-50 to-green-50 py-4 sm:py-8 lg:py-8">
      <section className="w-full lg:max-w-xl bg-white bg-opacity-95 rounded-xl sm:rounded-3xl lg:rounded-3xl shadow-lg sm:shadow-2xl lg:shadow-2xl p-4 sm:p-6 lg:p-10 border-t-4 sm:border-t-8 lg:border-t-8 border-blue-400 flex flex-col items-center">
        <div className="flex items-center gap-2 sm:gap-4 lg:gap-4 mb-4 sm:mb-6 lg:mb-6">
          {icon}
          <h3 className="text-xl sm:text-2xl lg:text-2xl font-extrabold text-blue-900 tracking-tight">Prediction Results</h3>
        </div>
        <div className="w-full flex flex-col lg:flex-row lg:justify-between gap-4 sm:gap-6 lg:gap-6 mb-6 sm:mb-8 lg:mb-8">
          <div className="flex-1 flex flex-col items-center justify-center bg-blue-50 rounded-lg sm:rounded-xl lg:rounded-xl p-4 sm:p-6 lg:p-6 shadow">
            <div className="text-base sm:text-lg lg:text-lg font-semibold text-blue-800 mb-1">Predicted Probability</div>
            <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-blue-700 mb-1">{riskPercent}%</div>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center bg-green-50 rounded-lg sm:rounded-xl lg:rounded-xl p-4 sm:p-6 lg:p-6 shadow">
            <div className="text-base sm:text-lg lg:text-lg font-semibold text-green-800 mb-1">Osteoporosis Likelihood</div>
            <div className={`text-2xl sm:text-3xl lg:text-3xl font-bold mb-1 ${riskColor}`}>{riskLabel}</div>
          </div>
        </div>
        {/* Overall summary */}
        <div className="w-full bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-3 mb-4 text-yellow-900 text-sm sm:text-base font-semibold">
          {overallSummary}
        </div>
        <div className="w-full bg-white rounded-lg sm:rounded-xl lg:rounded-xl border border-blue-100 p-4 sm:p-6 lg:p-6 shadow mb-4">
          <div className="text-base sm:text-lg lg:text-lg font-bold mb-2 text-blue-900 flex items-center gap-2">
            <FaUserMd className="text-blue-400 text-sm sm:text-base lg:text-base" /> Key Contributing Factors for This Patient
          </div>
          <ul className="list-disc pl-4 sm:pl-5 lg:pl-5 mt-1 text-gray-700 space-y-1 text-sm sm:text-base lg:text-base">
            {insights.length > 0 ? (
              insights.map((sentence, idx) => <li key={idx}>{sentence}</li>)
            ) : (
              <li>No specific contributing factors identified for this prediction.</li>
            )}
          </ul>
          <div className="text-xs text-gray-500 mt-2">*These insights are generated by AI based on your input, model interpretability tools, and medical guidelines.</div>
        </div>
      </section>
    </div>
  );
} 