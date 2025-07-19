"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import { usePrediction } from "./PredictionContext";
import { usePatientForm } from "./PatientFormContext";

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

const fieldMeta = [
  {
    section: "Basic Information",
    icon: "👤",
    fields: [
      { name: "Age", icon: "🎂", type: "number", min: 0, max: 120, placeholder: "Enter age" },
      { name: "Gender", icon: "⚧️", type: "select", options: genderOptions },
      { name: "Race/Ethnicity", icon: "🌎", type: "select", options: raceOptions },
      { name: "Body Weight", icon: "⚖️", type: "select", options: bodyWeightOptions },
    ],
  },
  {
    section: "Lifestyle & Intake",
    icon: "🏃",
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
    icon: "🏥",
    fields: [
      { name: "Hormonal Changes", icon: "🧬", type: "select", options: hormonalChangesOptions },
      { name: "Family History", icon: "👨‍👩‍👧‍👦", type: "select", options: familyHistoryOptions },
      { name: "Medical Conditions", icon: "🏥", type: "select", options: medicalConditionsOptions },
      { name: "Medications", icon: "💊", type: "select", options: medicationsOptions },
      { name: "Prior Fractures", icon: "🦴", type: "select", options: priorFracturesOptions },
    ],
  },
];

const initialForm: Record<string, string> = {};
fieldMeta.forEach(section => {
  section.fields.forEach(field => {
    initialForm[field.name] = "";
  });
});

export default function PredictionForm() {
  const { form, setForm } = usePatientForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { setPredictionData } = usePrediction();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Prediction failed");
      const data = await res.json();
      setPredictionData(data);
    } catch (err: any) {
      setError(err.message || "Prediction failed");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setPredictionData(null); // Clear result on any input change
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl mx-auto bg-white bg-opacity-95 rounded-2xl shadow-2xl p-10 mb-8">
      <h2 className="text-2xl font-bold mb-2 text-green-700 flex items-center gap-2">🩺 Osteoporosis Risk Prediction</h2>
      <p className="mb-8 text-gray-600">Fill in the patient details below to estimate osteoporosis risk.</p>
      {fieldMeta.map((section, idx) => (
        <div key={section.section}>
          <h2 className="text-xl font-semibold text-green-800 mb-4 flex items-center gap-2">
            {section.section}
            <span className="text-lg">{section.icon}</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {section.fields.map((field) => (
              <div key={field.name} className="flex flex-col">
                <label className="mb-1 font-semibold flex items-center gap-2 text-gray-800 text-base">
                  <span>{field.icon}</span> {field.name}
                </label>
                {field.type === "select" ? (
                  <select
                    name={field.name}
                    value={form[field.name]}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-300 focus:border-green-400 transition text-base bg-white text-gray-900 shadow-sm hover:bg-green-50"
                    required
                  >
                    <option value="">Select</option>
                    {Array.isArray(field.options) && field.options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                ) : field.type === "number" ? (
                  <input
                    type="number"
                    name={field.name}
                    value={form[field.name]}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-300 focus:border-green-400 transition text-base bg-white text-gray-900 shadow-sm hover:bg-green-50"
                    min={field.min}
                    max={field.max}
                    placeholder={field.placeholder}
                    required
                  />
                ) : (
                  <input
                    type="text"
                    name={field.name}
                    value={form[field.name]}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-300 focus:border-green-400 transition text-base bg-white text-gray-900 shadow-sm hover:bg-green-50"
                    placeholder={field.placeholder}
                    required
                  />
                )}
              </div>
            ))}
          </div>
          {idx < fieldMeta.length - 1 && <hr className="my-8 border-green-100" />}
        </div>
      ))}
      <div className="flex justify-center mt-4">
        <button type="submit" className="px-10 py-3 bg-green-600 text-white rounded-xl shadow-lg hover:bg-green-700 transition text-lg font-semibold flex items-center gap-2" disabled={loading}>
          🩺 Predict Risk
        </button>
      </div>
      {error && <div className="text-red-600 mt-2 text-center">{error}</div>}
    </form>
  );
} 