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
import ProtectedRoute from "../components/ProtectedRoute";

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
    <ProtectedRoute>
      <PredictionProvider>
        <PatientFormProvider initialForm={initialForm}>
          <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
            <div className="p-2 sm:p-4 lg:p-8 lg:max-w-5xl lg:mx-auto w-full">
              {activeTab === 1 && <PredictionForm />}
              <div className="w-full lg:bg-white lg:rounded-xl lg:shadow lg:p-6 lg:mt-6">{tabs[activeTab].component}</div>
            </div>
          </DashboardLayout>
        </PatientFormProvider>
      </PredictionProvider>
    </ProtectedRoute>
  );
} 