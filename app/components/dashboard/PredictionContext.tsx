import { createContext, useContext, useState, ReactNode } from "react";

interface PredictionContextType {
  predictionData: any;
  setPredictionData: (data: any) => void;
}

const PredictionContext = createContext<PredictionContextType | undefined>(undefined);

export function PredictionProvider({ children }: { children: ReactNode }) {
  const [predictionData, setPredictionData] = useState<any>(null);
  return (
    <PredictionContext.Provider value={{ predictionData, setPredictionData }}>
      {children}
    </PredictionContext.Provider>
  );
}

export function usePrediction() {
  const context = useContext(PredictionContext);
  if (!context) throw new Error("usePrediction must be used within a PredictionProvider");
  return context;
} 