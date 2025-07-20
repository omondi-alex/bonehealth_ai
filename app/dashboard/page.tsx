"use client";
import { useState, useEffect } from "react";
import Overview from "../components/dashboard/Overview";
import ClinicalInsights from "../components/dashboard/ClinicalInsights";
import DataScienceView from "../components/dashboard/DataScienceView";
import PatientView from "../components/dashboard/PatientView";
import { PredictionProvider, usePrediction } from "../components/dashboard/PredictionContext";
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

function ClinicalInsightsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-md flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-4 sm:p-8 relative mx-4 overflow-y-auto max-h-[90vh]">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors z-10"
          aria-label="Close"
        >
          <span className="text-2xl">×</span>
        </button>
        <ClinicalInsights />
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState(0);
  const [showInsightsModal, setShowInsightsModal] = useState(false);
  // Only usePrediction inside the provider
  function ClinicalInsightsModalTrigger() {
    const { predictionData, loading } = usePrediction();
    useEffect(() => {
      if (!loading && predictionData && activeTab === 1) {
        setShowInsightsModal(true);
      }
    }, [predictionData, loading, activeTab]);
    return (
      <ClinicalInsightsModal open={showInsightsModal} onClose={() => setShowInsightsModal(false)} />
    );
  }

  return (
    <ProtectedRoute>
      <PredictionProvider>
        <PatientFormProvider initialForm={initialForm}>
          <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
            <div className="p-2 sm:p-4 lg:p-8 lg:max-w-5xl lg:mx-auto w-full">
              {activeTab === 1 && <PredictionForm />}
              {activeTab === 1 && <ClinicalInsightsModalTrigger />}
              <div className="w-full lg:bg-white lg:rounded-xl lg:shadow lg:p-6 lg:mt-6">{tabs[activeTab].component}</div>
            </div>
          </DashboardLayout>
        </PatientFormProvider>
      </PredictionProvider>
    </ProtectedRoute>
  );
} 