"use client";
import { useState } from "react";
import Overview from "../components/dashboard/Overview";
import ClinicalInsights from "../components/dashboard/ClinicalInsights";
import DataScienceView from "../components/dashboard/DataScienceView";
import PatientView from "../components/dashboard/PatientView";
import { PredictionProvider } from "../components/dashboard/PredictionContext";
import PredictionForm from "../components/dashboard/PredictionForm";
import DashboardLayout from "./DashboardLayout";
import { PatientFormProvider } from "../components/dashboard/PatientFormContext";

const tabs = [
  { label: "Overview", component: <Overview /> },
  { label: "Clinical Insights", component: <ClinicalInsights /> },
  { label: "Data Scientist View", component: <DataScienceView /> },
  { label: "Patient View", component: <PatientView /> },
];

// Define initialForm here to pass to the provider
const initialForm: Record<string, string> = {
  "Age": "",
  "Gender": "",
  "Race/Ethnicity": "",
  "Body Weight": "",
  "Calcium Intake": "",
  "Vitamin D Intake": "",
  "Physical Activity": "",
  "Smoking": "",
  "Alcohol Consumption": "",
  "Hormonal Changes": "",
  "Family History": "",
  "Medical Conditions": "",
  "Medications": "",
  "Prior Fractures": "",
};

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <PredictionProvider>
      <PatientFormProvider initialForm={initialForm}>
        <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
          <div className="p-8 max-w-5xl mx-auto w-full">
            {activeTab === 1 && <PredictionForm />}
            <div className="bg-white rounded-xl shadow p-6 mt-6">{tabs[activeTab].component}</div>
          </div>
        </DashboardLayout>
      </PatientFormProvider>
    </PredictionProvider>
  );
} 