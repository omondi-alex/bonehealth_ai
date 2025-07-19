"use client";
import React, { useState } from "react";
import ProtectedRoute from "../components/ProtectedRoute";

const initialState = {
  Age: '',
  Gender: '',
  "Hormonal Changes": '',
  "Family History": '',
  "Race/Ethnicity": '',
  "Body Weight": '',
  "Calcium Intake": '',
  "Vitamin D Intake": '',
  "Physical Activity": '',
  Smoking: '',
  "Alcohol Consumption": '',
  "Medical Conditions": '',
  Medications: '',
  "Prior Fractures": '',
};

const genderOptions = ["Female", "Male"];
const hormonalChangesOptions = ["Normal", "Postmenopausal"];
const familyHistoryOptions = ["Yes", "No"];
const raceOptions = ["Asian", "Caucasian", "African American"];
const bodyWeightOptions = ["Underweight", "Normal"];
const calciumIntakeOptions = ["Low", "Adequate"];
const vitaminDIntakeOptions = ["Sufficient", "Insufficient"];
const physicalActivityOptions = ["Sedentary", "Active"];
const smokingOptions = ["Yes", "No"];
const alcoholConsumptionOptions = ["Moderate", "None"];
const medicalConditionsOptions = ["Rheumatoid Arthritis", "Hyperthyroidism", "None"];
const medicationsOptions = ["Corticosteroids", "None"];
const priorFracturesOptions = ["Yes", "No"];

const riskLevels = ["Low", "Medium", "High"];
const riskColors = { Low: "text-green-600", Medium: "text-yellow-600", High: "text-red-600" };
const riskIcons = { Low: "✅", Medium: "⚠️", High: "❗" };

const riskExplanations: Record<string, string> = {
  Low: "Your risk of osteoporosis is low. Keep up your healthy habits!",
  Medium: "You have a moderate risk of osteoporosis. Consider lifestyle improvements and regular checkups.",
  High: "You have a high risk of osteoporosis. Please consult your healthcare provider for further assessment and guidance.",
};

const riskTips: Record<string, string[]> = {
  Low: [
    "Maintain a balanced diet rich in calcium and vitamin D.",
    "Stay physically active with weight-bearing exercises.",
    "Avoid smoking and excessive alcohol consumption.",
  ],
  Medium: [
    "Increase your calcium and vitamin D intake.",
    "Engage in regular physical activity.",
    "Discuss bone density testing with your doctor.",
  ],
  High: [
    "Consult your doctor about bone density testing and treatment options.",
    "Consider medication or supplements as prescribed.",
    "Take steps to prevent falls and fractures at home.",
  ],
};

type Field =
  | { name: string; icon: string; type: 'number'; min: number; max: number; placeholder: string }
  | { name: string; icon: string; type: 'select'; options: string[] }
  | { name: string; icon: string; type: 'text'; placeholder: string };

type Section = { section: string; fields: Field[] };

const fieldMeta: Section[] = [
  {
    section: "Basic Information",
    fields: [
      { name: "Age", icon: "🎂", type: "number", min: 0, max: 120, placeholder: "Enter age" },
      { name: "Gender", icon: "⚧️", type: "select", options: genderOptions },
      { name: "Race/Ethnicity", icon: "🌎", type: "select", options: raceOptions },
      { name: "Body Weight", icon: "⚖️", type: "select", options: bodyWeightOptions },
    ],
  },
  {
    section: "Lifestyle & Intake",
    fields: [
      { name: "Calcium Intake", icon: "🥛", type: "select", options: calciumIntakeOptions },
      { name: "Vitamin D Intake", icon: "☀️", type: "select", options: vitaminDIntakeOptions },
      { name: "Physical Activity", icon: "🏃", type: "select", options: physicalActivityOptions },
      { name: "Smoking", icon: "🚬", type: "select", options: smokingOptions },
      { name: "Alcohol Consumption", icon: "🍷", type: "select", options: alcoholConsumptionOptions },
    ],
  },
  {
    section: "Medical History",
    fields: [
      { name: "Hormonal Changes", icon: "🧬", type: "select", options: hormonalChangesOptions },
      { name: "Family History", icon: "👨‍👩‍👧‍👦", type: "select", options: familyHistoryOptions },
      { name: "Medical Conditions", icon: "🏥", type: "select", options: medicalConditionsOptions },
      { name: "Medications", icon: "💊", type: "select", options: medicationsOptions },
      { name: "Prior Fractures", icon: "🦴", type: "select", options: priorFracturesOptions },
    ],
  },
];

export default function PredictPage() {
  const [form, setForm] = useState(initialState);
  const [result, setResult] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Mock prediction: random risk
    const risk = riskLevels[Math.floor(Math.random() * riskLevels.length)];
    setResult(risk);
  }

  return (
    <ProtectedRoute>
      <div className="min-h-[80vh] w-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100 py-12 px-4">
        <div className="max-w-2xl w-full bg-white bg-opacity-95 rounded-2xl shadow-2xl p-10">
          <h1 className="text-3xl font-bold mb-2 text-blue-700 flex items-center gap-2">🩺 Osteoporosis Risk Prediction</h1>
          <p className="mb-8 text-gray-600">Fill in the patient details below to estimate osteoporosis risk.</p>
          <form onSubmit={handleSubmit} className="space-y-8">
            {fieldMeta.map((section, idx) => (
              <div key={section.section}>
                <h2 className="text-xl font-semibold text-blue-800 mb-4 flex items-center gap-2">
                  {section.section}
                  <span className="text-lg">{idx === 0 ? "👤" : idx === 1 ? "🏃" : "🏥"}</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {section.fields.map(field => (
                    <div key={field.name} className="flex flex-col">
                      <label className="mb-1 font-semibold flex items-center gap-2 text-gray-800 text-base">
                        <span>{field.icon}</span> {field.name}
                      </label>
                      {field.type === "select" ? (
                        <select
                          name={field.name}
                          value={form[field.name as keyof typeof form]}
                          onChange={handleChange}
                          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition text-base bg-white text-gray-900 shadow-sm hover:bg-blue-50"
                          required
                        >
                          <option value="">Select</option>
                          {field.options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                      ) : field.type === "number" ? (
                        <input
                          type="number"
                          name={field.name}
                          value={form[field.name as keyof typeof form]}
                          onChange={handleChange}
                          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition text-base bg-white text-gray-900 shadow-sm hover:bg-blue-50"
                          min={field.min}
                          max={field.max}
                          placeholder={field.placeholder}
                          required
                        />
                      ) : (
                        <input
                          type="text"
                          name={field.name}
                          value={form[field.name as keyof typeof form]}
                          onChange={handleChange}
                          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition text-base bg-white text-gray-900 shadow-sm hover:bg-blue-50"
                          placeholder={field.placeholder}
                          required
                        />
                      )}
                    </div>
                  ))}
                </div>
                {idx < fieldMeta.length - 1 && <hr className="my-8 border-blue-100" />}
              </div>
            ))}
            <div className="flex justify-center mt-4">
              <button type="submit" className="px-10 py-3 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 transition text-lg font-semibold flex items-center gap-2">🩺 Predict Risk</button>
            </div>
          </form>
          {result && (
            <div className="mt-12 flex flex-col items-center justify-center w-full">
              <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center border-t-4 border-b-4 border-blue-200 mb-6">
                <div className={`text-7xl mb-2 ${riskColors[result as keyof typeof riskColors]}`}>{riskIcons[result as keyof typeof riskIcons]}</div>
                <span className="text-2xl font-bold mb-2">Predicted Risk: <span className={riskColors[result as keyof typeof riskColors]}>{result}</span></span>
                <p className="text-gray-700 text-center mb-4">{riskExplanations[result]}</p>
                {/* Risk Meter */}
                <div className="w-full flex flex-col items-center mb-4">
                  <div className="w-full h-4 bg-gray-200 rounded-full relative overflow-hidden">
                    <div
                      className={`h-4 rounded-full transition-all duration-500 ${
                        result === 'Low' ? 'bg-green-400 w-1/3' : result === 'Medium' ? 'bg-yellow-400 w-2/3' : 'bg-red-500 w-full'
                      }`}
                    ></div>
                  </div>
                  <div className="flex justify-between w-full text-xs mt-1 text-gray-500">
                    <span>Low</span>
                    <span>Medium</span>
                    <span>High</span>
                  </div>
                </div>
                {/* Tips */}
                <div className="mt-2 w-full">
                  <span className="font-semibold text-blue-700">Tips:</span>
                  <ul className="list-disc list-inside text-gray-700 mt-1 space-y-1">
                    {riskTips[result].map((tip, idx) => (
                      <li key={idx}>{tip}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
} 