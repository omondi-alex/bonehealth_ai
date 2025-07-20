import { createContext, useContext, useState, ReactNode } from "react";

interface PredictionContextType {
  predictionData: any;
  setPredictionData: (data: any) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const PredictionContext = createContext<PredictionContextType | undefined>(undefined);

export function PredictionProvider({ children }: { children: ReactNode }) {
  const [predictionData, setPredictionData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  return (
    <PredictionContext.Provider value={{ predictionData, setPredictionData, loading, setLoading }}>
      {children}
    </PredictionContext.Provider>
  );
}

export function usePrediction() {
  const context = useContext(PredictionContext);
  if (!context) throw new Error("usePrediction must be used within a PredictionProvider");
  return context;
} 