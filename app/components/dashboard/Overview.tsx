import React from "react";

export default function Overview() {
  return (
    <div className="space-y-6 sm:space-y-8 w-full lg:max-w-3xl lg:mx-auto bg-white bg-opacity-95 rounded-xl sm:rounded-2xl lg:rounded-2xl shadow-lg sm:shadow-2xl lg:shadow-2xl p-4 sm:p-6 lg:p-10">
      <h1 className="text-2xl sm:text-3xl lg:text-3xl font-bold mb-3 sm:mb-4 lg:mb-4 text-green-800 leading-tight">
        Overview: Osteoporosis Risk Assessment Model
      </h1>
      
      <p className="mb-2 text-gray-700 text-sm sm:text-base lg:text-base leading-relaxed">
        Our model predicts whether an individual is likely to have osteoporosis based on their demographic information, lifestyle factors, medical history, and nutritional intake. Specifically, it uses features such as Age, Gender, Hormonal Changes, Family History, Race/Ethnicity, Body Weight, Calcium Intake, Vitamin D Intake, Physical Activity, Smoking habits, Alcohol Consumption, relevant Medical Conditions, Medications, and Prior Fractures to estimate the probability that a person has osteoporosis.
      </p>
      
      <p className="mb-4 sm:mb-6 lg:mb-4 text-gray-700 text-sm sm:text-base lg:text-base">
        The output is a binary classification: <span className="font-bold text-green-700">1 = Osteoporosis likely</span>, <span className="font-bold text-red-700">0 = Osteoporosis unlikely</span>.
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-6 mb-6 sm:mb-8 lg:mb-8">
        <div className="bg-violet-50 rounded-lg sm:rounded-xl lg:rounded-xl p-4 sm:p-6 lg:p-6 shadow flex flex-col justify-between">
          <h2 className="text-base sm:text-lg lg:text-lg font-bold text-violet-800 mb-2 sm:mb-3 lg:mb-2">Model Purpose & Utility</h2>
          <ul className="list-disc pl-4 sm:pl-5 lg:pl-5 text-gray-800 space-y-1 text-sm sm:text-base lg:text-base">
            <li>Screen and prioritize patients for further diagnostic tests (like bone density scans).</li>
            <li>Identify high-risk groups who may benefit from preventive interventions.</li>
            <li>Support clinical decision-making by highlighting key risk factors for each patient.</li>
          </ul>
        </div>
        
        <div className="bg-green-50 rounded-lg sm:rounded-xl lg:rounded-xl p-4 sm:p-6 lg:p-6 shadow flex flex-col justify-between">
          <h2 className="text-base sm:text-lg lg:text-lg font-bold text-green-800 mb-2 sm:mb-3 lg:mb-2">Overall Model Performance (Mock Data)</h2>
          <div className="text-gray-800 mb-1 text-sm sm:text-base lg:text-base">
            Overall Accuracy: <span className="font-bold text-green-700">87%</span>
          </div>
          <div className="text-gray-800 mb-2 text-sm sm:text-base lg:text-base">
            Area Under ROC Curve (AUC): <span className="font-bold text-green-700">0.89</span>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 rounded-lg sm:rounded-xl lg:rounded-xl p-4 sm:p-6 lg:p-6 shadow">
        <h2 className="text-base sm:text-lg lg:text-lg font-bold text-gray-800 mb-2 sm:mb-3 lg:mb-2">Key Feature Insights (Mock Data)</h2>
        <ul className="list-disc pl-4 sm:pl-5 lg:pl-5 text-gray-800 space-y-1 text-sm sm:text-base lg:text-base">
          <li><span className="font-bold">Age:</span> The most significant predictor, risk increases with age.</li>
          <li><span className="font-bold">Family History:</span> A strong indicator due to genetic predisposition.</li>
          <li><span className="font-bold">Vitamin D Intake:</span> Lower intake correlates with higher risk.</li>
          <li><span className="font-bold">Prior Fractures:</span> Previous fractures are a strong predictor of future risk.</li>
        </ul>
      </div>
    </div>
  );
} 