import React, { createContext, useContext, useState, ReactNode } from "react";

export type PatientForm = { [key: string]: any };

type PatientFormContextType = {
  form: PatientForm;
  setForm: React.Dispatch<React.SetStateAction<PatientForm>>;
};

const PatientFormContext = createContext<PatientFormContextType | undefined>(undefined);

export function usePatientForm() {
  const ctx = useContext(PatientFormContext);
  if (!ctx) throw new Error("usePatientForm must be used within PatientFormProvider");
  return ctx;
}

export function PatientFormProvider({ children, initialForm }: { children: ReactNode; initialForm: PatientForm }) {
  const [form, setForm] = useState<PatientForm>(initialForm);
  return (
    <PatientFormContext.Provider value={{ form, setForm }}>
      {children}
    </PatientFormContext.Provider>
  );
} 