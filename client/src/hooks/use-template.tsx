import { createContext, useContext, useState, ReactNode } from "react";

type TemplateContextType = {
  activeTemplate: string;
  setActiveTemplate: (template: string) => void;
};

const TemplateContext = createContext<TemplateContextType | undefined>(undefined);

export function TemplateProvider({ children }: { children: ReactNode }) {
  const [activeTemplate, setActiveTemplate] = useState("Minimal");
  return (
    <TemplateContext.Provider value={{ activeTemplate, setActiveTemplate }}>
      {children}
    </TemplateContext.Provider>
  );
}

export function useTemplate() {
  const context = useContext(TemplateContext);
  if (!context) throw new Error("useTemplate must be used within a TemplateProvider");
  return context;
}
