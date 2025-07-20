import { usePrediction } from "./PredictionContext";
import { useState } from "react";
import { FaStethoscope } from "react-icons/fa";

export default function PatientView() {
  const { predictionData } = usePrediction();
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="space-y-6 sm:space-y-8 w-full lg:max-w-3xl lg:mx-auto bg-white bg-opacity-95 rounded-xl sm:rounded-2xl lg:rounded-2xl shadow-lg sm:shadow-2xl lg:shadow-2xl p-4 sm:p-6 lg:p-4 lg:overflow-x-auto">
      <h1 className="text-2xl sm:text-3xl lg:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 lg:mb-6 text-gray-900 leading-tight">
        Patient View: Your Osteoporosis Risk
      </h1>
      {riskPercent !== null && (
        <div className="bg-blue-50 rounded-lg sm:rounded-xl lg:rounded-xl p-4 sm:p-6 lg:p-4 lg:p-6 lg:p-8 flex flex-col items-center shadow mb-4 w-full">
          <div className="text-base sm:text-lg lg:text-lg font-semibold text-blue-800 mb-2 text-center">Understand Your Estimated Risk</div>
          <div className={`text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-2 ${riskColor}`}>{riskPercent}%</div>
          <div className={`text-lg sm:text-xl lg:text-xl font-bold mb-4 ${riskColor}`}>{riskLabel}</div>
          <div className="w-full max-w-xs sm:max-w-md lg:max-w-lg h-3 bg-gray-200 rounded-full overflow-hidden mb-2">
            <div className={`${barColor} h-3 rounded-full`} style={{ width: `${riskPercent}%` }} />
          </div>
        </div>
      )}
      {riskPercent !== null && (
        <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-xl border border-gray-200 p-4 sm:p-6 lg:p-4 lg:p-6 shadow w-full">
          <h2 className="text-base sm:text-lg lg:text-lg font-bold mb-2 sm:mb-3 lg:mb-2 text-gray-900">What Does This Mean For You?</h2>
          <p className="mb-4 text-gray-800 text-sm sm:text-base lg:text-base">
            Based on your information, our model estimates your likelihood of having osteoporosis. A score of <span className="font-bold">{riskPercent}%</span> means there's an estimated {riskPercent}% chance you might have osteoporosis. This is an estimate to help you and your doctor. It's not a diagnosis.
          </p>
          <div>
            <div className="font-semibold mb-1 text-gray-900 text-sm sm:text-base lg:text-base">Key Factors Contributing to Your Risk</div>
            <ul className="list-disc pl-4 sm:pl-5 lg:pl-5 text-gray-800 space-y-1 text-sm sm:text-base lg:text-base">
              {Array.isArray(predictionData?.contributing_factors) && predictionData.contributing_factors.length > 0 ? (
                predictionData.contributing_factors.map((factor: { feature: string; shap: number }, idx: number) => (
                  <li key={idx}>
                    {factor.feature}: {factor.shap > 0 ? 'Increases' : 'Decreases'} risk (SHAP value: {factor.shap.toFixed(3)})
                  </li>
                ))
              ) : (
                <li>No specific contributing factors identified for this prediction.</li>
              )}
            </ul>
          </div>
        </div>
      )}
      {riskPercent !== null && (
        <div className="bg-red-50 border border-red-200 rounded-lg sm:rounded-xl lg:rounded-xl p-4 sm:p-6 lg:p-4 lg:p-6 shadow w-full">
          <div className="font-bold text-base sm:text-lg lg:text-lg text-red-700 mb-2">Important Disclaimer</div>
          <div className="mb-2 text-red-700 font-semibold text-sm sm:text-base lg:text-base">
            This tool provides an estimated risk only and is not a substitute for professional medical advice, diagnosis, or treatment.
          </div>
          <div className="mb-4 text-gray-800 text-sm sm:text-base lg:text-base">
            Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
          </div>
          <div className="font-bold text-red-700 mb-1 text-sm sm:text-base lg:text-base">Next Steps</div>
          <div className="text-gray-800 text-sm sm:text-base lg:text-base">
            We recommend discussing these results with your healthcare provider. They can determine if further tests, such as a bone density scan, are appropriate for you.
          </div>
        </div>
      )}
    </div>
  );
} 