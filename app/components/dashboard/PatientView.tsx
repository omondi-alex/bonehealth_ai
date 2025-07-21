import { usePrediction } from "./PredictionContext";
import { usePatientForm } from "./PatientFormContext";
import { FaStethoscope, FaUserMd, FaRegHospital, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import type { ReactElement } from "react";

function getPatientFactorSentence(feature: string, value: string, shap: number): { icon: string; text: string } {
  if (feature === "Age") {
    const age = parseInt(value, 10);
    if (isNaN(age)) return { icon: "🎂", text: "We couldn't determine your age for this analysis." };
    if (age < 40) return { icon: "🎂", text: `At ${age}, age is not a significant risk for osteoporosis.` };
    if (age >= 65) return { icon: "🎂", text: `At ${age}, age is a major risk factor. Staying active and eating well is especially important.` };
    if (age >= 50) return { icon: "🎂", text: `At ${age}, age moderately increases your risk. Keep up with healthy habits!` };
    return { icon: "🎂", text: `At ${age}, age is a minor risk factor.` };
  }
  if (feature === "Gender") {
    if (value === "Female") return { icon: "♀️", text: "Women are at higher risk for osteoporosis, especially after menopause." };
    if (value === "Male") return { icon: "♂️", text: "Men have a lower risk, but bone health is still important as you age." };
    return { icon: "⚧️", text: "We couldn't determine your gender for this analysis." };
  }
  if (feature === "Hormonal Changes") {
    if (value === "Postmenopausal") return { icon: "🧬", text: "After menopause, bone loss can speed up. Regular checkups and calcium are important." };
    return { icon: "🧬", text: "Normal hormone levels help protect your bones." };
  }
  if (feature === "Body Weight") {
    if (value === "Underweight") return { icon: "⚖️", text: "Low body weight can increase your risk. Talk to your doctor about healthy nutrition." };
    if (value === "Normal") return { icon: "⚖️", text: "Your body weight is in a healthy range for bone strength." };
    return { icon: "⚖️", text: "We couldn't determine your body weight for this analysis." };
  }
  if (feature === "Calcium Intake") {
    if (value === "Low") return { icon: "🥛", text: "Low calcium intake can weaken bones. Try to include more calcium-rich foods in your diet." };
    if (value === "Adequate") return { icon: "🥛", text: "Great job getting enough calcium! This helps keep your bones strong." };
    return { icon: "🥛", text: "We couldn't determine your calcium intake for this analysis." };
  }
  if (feature === "Physical Activity") {
    if (value === "Sedentary") return { icon: "🏃", text: "Being more active can help strengthen your bones. Even walking helps!" };
    if (value === "Active") return { icon: "🏃", text: "Your activity level is helping to protect your bones." };
    return { icon: "🏃", text: "We couldn't determine your activity level for this analysis." };
  }
  if (feature === "Smoking") {
    if (value === "Yes") return { icon: "🚬", text: "Smoking can weaken bones. Quitting is one of the best things you can do for your health." };
    if (value === "No") return { icon: "🚭", text: "Not smoking helps keep your bones healthy." };
    return { icon: "🚬", text: "We couldn't determine your smoking status for this analysis." };
  }
  if (feature === "Alcohol Consumption") {
    if (value === "Moderate") return { icon: "🍷", text: "Drinking alcohol in moderation or more can increase your risk. Try to limit your intake." };
    if (value === "None") return { icon: "🚱", text: "Not drinking alcohol helps protect your bones." };
    return { icon: "🍷", text: "We couldn't determine your alcohol intake for this analysis." };
  }
  if (feature === "Family History") {
    if (value === "Yes") return { icon: "👨‍👩‍👧‍👦", text: "A family history of osteoporosis means you should be extra proactive about bone health." };
    if (value === "No") return { icon: "👨‍👩‍👧‍👦", text: "No family history helps lower your risk." };
    return { icon: "👨‍👩‍👧‍👦", text: "We couldn't determine your family history for this analysis." };
  }
  if (feature === "Prior Fractures") {
    if (value === "Yes") return { icon: "🦴", text: "A previous fracture is a strong sign to take extra care of your bones." };
    if (value === "No") return { icon: "🦴", text: "No prior fractures is a good sign for your bone health." };
    return { icon: "🦴", text: "We couldn't determine your fracture history for this analysis." };
  }
  // Fallback
  if (shap > 0) return { icon: "💡", text: `${feature}: May increase your risk.` };
  return { icon: "💡", text: `${feature}: May help protect your bones.` };
}

function getPatientSummary(riskPercent: number, riskLabel: string): { icon: ReactElement; color: string; text: string } {
  if (riskPercent >= 70) {
    return {
      icon: <FaExclamationTriangle className="text-red-500 inline mr-2" />, color: "bg-red-50 border-red-400 text-red-900", text: `Your results show a HIGH risk for osteoporosis (${riskPercent}%). Please talk to your doctor soon about next steps. Early action can make a big difference!`
    };
  } else if (riskPercent >= 30) {
    return {
      icon: <FaStethoscope className="text-yellow-500 inline mr-2" />, color: "bg-yellow-50 border-yellow-400 text-yellow-900", text: `Your results show a MODERATE risk for osteoporosis (${riskPercent}%). Healthy habits and regular checkups are important for you.`
    };
  } else {
    return {
      icon: <FaCheckCircle className="text-green-500 inline mr-2" />, color: "bg-green-50 border-green-400 text-green-900", text: `Your results show a LOW risk for osteoporosis (${riskPercent}%). Keep up your healthy lifestyle and check in with your doctor as needed!`
    };
  }
}

function getPatientTips(riskPercent: number): string[] {
  if (riskPercent >= 70) {
    return [
      "Schedule a checkup with your doctor soon.",
      "Ask about a bone density scan (DEXA).",
      "Eat foods rich in calcium and vitamin D.",
      "Stay active with weight-bearing exercise.",
      "Avoid smoking and limit alcohol.",
      "Discuss medications or supplements if recommended."
    ];
  } else if (riskPercent >= 30) {
    return [
      "Maintain a healthy diet with enough calcium and vitamin D.",
      "Stay active, walking and light exercise help.",
      "Avoid smoking and limit alcohol.",
      "Talk to your doctor about your bone health at your next visit."
    ];
  } else {
    return [
      "Keep up your healthy habits!",
      "Eat a balanced diet with calcium and vitamin D.",
      "Stay active and avoid smoking.",
      "Have regular checkups to monitor your bone health."
    ];
  }
}

export default function PatientView({ onRequestReport }: { onRequestReport?: () => void } = {}) {
  const { predictionData, loading } = usePrediction();
  const { form } = usePatientForm();

  let riskPercent: number | null = null;
  let riskLabel = "";
  let riskColor = "";
  let barColor = "";

  if (predictionData && typeof predictionData.probability === "number") {
    riskPercent = Math.round(predictionData.probability * 100);
    if (riskPercent >= 70) {
      riskLabel = "High Risk";
      riskColor = "text-red-600";
      barColor = "bg-red-500";
    } else if (riskPercent >= 30) {
      riskLabel = "Moderate Risk";
      riskColor = "text-yellow-600";
      barColor = "bg-yellow-400";
    } else {
      riskLabel = "Low Risk";
      riskColor = "text-green-600";
      barColor = "bg-green-500";
    }
  }

  // Loader
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh]">
        <FaStethoscope className="animate-spin text-blue-500 text-5xl mb-4" />
        <div className="text-blue-700 text-lg font-semibold">Analyzing patient data...</div>
      </div>
    );
  }

  // If no prediction/report exists, show a prompt to make a request
  if (!predictionData || typeof predictionData.probability !== "number") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] w-full lg:max-w-3xl lg:mx-auto bg-gradient-to-br from-blue-50 to-green-50 rounded-xl shadow-lg p-8">
        <FaExclamationTriangle className="text-yellow-400 text-5xl mb-4" />
        <div className="text-blue-900 text-xl font-bold mb-2 text-center">No Patient Report Found</div>
        <div className="text-gray-700 text-base mb-6 text-center max-w-md">
          To view a patient report, please make a request in the <span className="font-semibold text-blue-700">Clinical Insights</span> tab first.
        </div>
        {onRequestReport && (
          <button
            onClick={onRequestReport}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-blue-700 transition text-base"
          >
            Go to Clinical Insights
          </button>
        )}
      </div>
    );
  }

  // Patient-friendly summary
  const patientSummary = (riskPercent !== null) ? getPatientSummary(riskPercent, riskLabel) : null;

  // Patient-friendly insights
  let insights: { icon: string; text: string }[] = [];
  if (Array.isArray(predictionData?.contributing_factors) && predictionData.contributing_factors.length > 0) {
    const sorted = [...predictionData.contributing_factors].sort((a, b) => Math.abs(b.shap) - Math.abs(a.shap));
    insights = sorted.map((factor: { feature: string; shap: number }) => {
      const value = form[factor.feature] || "";
      return getPatientFactorSentence(factor.feature, value, factor.shap);
    });
  }

  // Patient tips
  const tips = (riskPercent !== null) ? getPatientTips(riskPercent) : [];

  return (
    <div className="space-y-6 sm:space-y-8 w-full lg:max-w-3xl lg:mx-auto bg-gradient-to-br from-blue-50 to-green-50 rounded-xl sm:rounded-2xl lg:rounded-2xl shadow-lg sm:shadow-2xl lg:shadow-2xl p-4 sm:p-6 lg:p-8 lg:overflow-x-auto">
      {/* Hospital-style header */}
      <div className="flex items-center gap-3 mb-2">
        <FaRegHospital className="text-blue-500 text-3xl sm:text-4xl lg:text-4xl" />
        <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-900">BoneHealth AI Patient Report</span>
      </div>
      {riskPercent !== null && (
        <div className="bg-white rounded-xl border-l-8 shadow p-4 mb-4 flex items-center gap-3 border-blue-400">
          <FaUserMd className="text-blue-500 text-2xl sm:text-3xl" />
          <span className="text-lg sm:text-xl font-semibold text-blue-900">Doctor's Note: This report is generated by AI and reviewed by our clinical team.</span>
        </div>
      )}
      {riskPercent !== null && patientSummary && (
        <div className={`w-full border-l-4 rounded-lg p-3 mb-4 font-semibold flex items-center gap-2 ${patientSummary.color}`}> 
          {patientSummary.icon}
          <span>{patientSummary.text}</span>
        </div>
      )}
      {riskPercent !== null && (
        <div className="bg-white rounded-xl shadow border border-gray-200 p-4 sm:p-6 mb-4 flex flex-col items-center">
          <div className="text-base sm:text-lg font-semibold text-blue-800 mb-2 text-center">Your Estimated Osteoporosis Risk</div>
          <div className={`text-5xl font-extrabold mb-2 ${riskColor}`}>{riskPercent}%</div>
          <div className={`text-lg font-bold mb-4 ${riskColor}`}>{riskLabel}</div>
          <div className="w-full max-w-xs sm:max-w-md h-3 bg-gray-200 rounded-full overflow-hidden mb-2">
            <div className={`${barColor} h-3 rounded-full`} style={{ width: `${riskPercent}%` }} />
          </div>
        </div>
      )}
      {riskPercent !== null && (
        <div className="bg-white rounded-xl shadow border border-blue-100 p-4 sm:p-6 mb-4">
          <h2 className="text-lg font-bold mb-2 text-blue-900 flex items-center gap-2">🦴 Key Factors for You</h2>
          <ul className="space-y-2">
            {insights.length > 0 ? (
              insights.map((item, idx) => (
                <li key={idx} className="flex items-center gap-2 text-gray-800 text-base">
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.text}</span>
                </li>
              ))
            ) : (
              <li>No specific contributing factors identified for this prediction.</li>
            )}
          </ul>
        </div>
      )}
      {riskPercent !== null && tips.length > 0 && (
        <div className="bg-green-50 rounded-xl shadow border border-green-200 p-4 sm:p-6 mb-4">
          <h2 className="text-lg font-bold mb-2 text-green-900 flex items-center gap-2">💡 What You Can Do</h2>
          <ul className="list-disc pl-5 space-y-1 text-green-900 text-base">
            {tips.map((tip, idx) => (
              <li key={idx}>{tip}</li>
            ))}
          </ul>
        </div>
      )}
      {riskPercent !== null && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 sm:p-6 shadow w-full">
          <div className="font-bold text-lg text-red-700 mb-2 flex items-center gap-2"><FaExclamationTriangle className="inline text-red-400" /> Important Disclaimer</div>
          <div className="mb-2 text-red-700 font-semibold text-base">
            This tool provides an estimated risk only and is not a substitute for professional medical advice, diagnosis, or treatment.
          </div>
          <div className="mb-4 text-gray-800 text-base">
            Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
          </div>
          <div className="font-bold text-red-700 mb-1 text-base">Next Steps</div>
          <div className="text-gray-800 text-base">
            We recommend discussing these results with your healthcare provider. They can help you decide if further tests, like a bone density scan, are right for you, and support you in keeping your bones healthy.
          </div>
        </div>
      )}
    </div>
  );
} 