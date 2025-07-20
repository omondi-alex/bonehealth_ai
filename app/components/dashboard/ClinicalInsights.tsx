import { usePrediction } from "./PredictionContext";
import { FaHeartbeat, FaVial, FaUserMd } from "react-icons/fa";

export default function ClinicalInsights() {
  const { predictionData } = usePrediction();

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
        
        <div className="w-full bg-white rounded-lg sm:rounded-xl lg:rounded-xl border border-blue-100 p-4 sm:p-6 lg:p-6 shadow mb-4">
          <div className="text-base sm:text-lg lg:text-lg font-bold mb-2 text-blue-900 flex items-center gap-2">
            <FaUserMd className="text-blue-400 text-sm sm:text-base lg:text-base" /> Key Contributing Factors for This Patient
          </div>
          <ul className="list-disc pl-4 sm:pl-5 lg:pl-5 mt-1 text-gray-700 space-y-1 text-sm sm:text-base lg:text-base">
            <li>Age: Older age significantly increases risk.</li>
            <li>Family History: Genetic predisposition plays a role.</li>
            <li>Calcium Intake: Low intake can weaken bones.</li>
          </ul>
          <div className="text-xs text-gray-500 mt-2">*This explanation is illustrative. In a real system, this would be personalized via model interpretability tools.</div>
        </div>
      </section>
    </div>
  );
} 