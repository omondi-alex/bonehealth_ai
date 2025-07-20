"use client";
import { useState, useEffect, useRef } from "react";
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

function ClinicalInsightsModal({ open, onClose, onPatientReport }: { open: boolean; onClose: () => void; onPatientReport: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-md flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full relative mx-4 max-h-[90vh] flex flex-col">
        {/* Modal Header with Close Button */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl z-20">
          <h2 className="text-lg sm:text-xl font-bold text-blue-900">Clinical Insights</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2"
            aria-label="Close"
          >
            <span className="text-2xl">×</span>
          </button>
        </div>
        {/* Modal Content */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-8">
          <ClinicalInsights />
          <div className="flex justify-center mt-8 mb-2">
            <button
              type="button"
              onClick={onPatientReport}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold shadow hover:bg-blue-700 transition text-base sm:text-lg"
            >
              Patient Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ClinicalInsightsModalTrigger({ open, setOpen, goToPatientView, activeTab }: { open: boolean; setOpen: (v: boolean) => void; goToPatientView: () => void; activeTab: number }) {
  const { predictionData, loading } = usePrediction();
  const lastPredictionId = useRef<string | null>(null);
  const [shouldShowPopup, setShouldShowPopup] = useState(false);

  // Generate a unique id for the prediction
  const predictionId = predictionData ? JSON.stringify(predictionData) : null;

  // Only set shouldShowPopup to true if a new prediction is made while on Clinical Insights tab
  useEffect(() => {
    if (!loading && predictionData && predictionId !== lastPredictionId.current) {
      if (activeTab === 1) {
        setOpen(true);
        setShouldShowPopup(true);
        lastPredictionId.current = predictionId;
      }
    }
    // If user navigates away from Clinical Insights, close the popup and reset shouldShowPopup
    if (activeTab !== 1) {
      setOpen(false);
      setShouldShowPopup(false);
    }
  }, [predictionData, loading, activeTab, predictionId, setOpen]);

  // Only show the modal if shouldShowPopup is true and tab is active
  return (
    <ClinicalInsightsModal open={open && shouldShowPopup && activeTab === 1} onClose={() => { setOpen(false); setShouldShowPopup(false); }} onPatientReport={goToPatientView} />
  );
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState(0);
  const [showInsightsModal, setShowInsightsModal] = useState(false);

  // Handler to go to Patient View and close modal
  const goToPatientView = () => {
    setShowInsightsModal(false);
    setActiveTab(3); // Patient View tab index
  };

  return (
    <ProtectedRoute>
      <PredictionProvider>
        <PatientFormProvider initialForm={initialForm}>
          <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
            <div className="p-2 sm:p-4 lg:p-8 lg:max-w-5xl lg:mx-auto w-full">
              {activeTab === 1 && <PredictionForm />}
              {activeTab === 1 && (
                <ClinicalInsightsModalTrigger open={showInsightsModal} setOpen={setShowInsightsModal} goToPatientView={goToPatientView} activeTab={activeTab} />
              )}
              <div className="w-full lg:bg-white lg:rounded-xl lg:shadow lg:p-6 lg:mt-6">{tabs[activeTab].component}</div>
            </div>
          </DashboardLayout>
        </PatientFormProvider>
      </PredictionProvider>
    </ProtectedRoute>
  );
} 