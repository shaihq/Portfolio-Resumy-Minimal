import { createContext, useContext, useState, ReactNode } from "react";

type TemplateContextType = {
  activeTemplate: string;
  setActiveTemplate: (template: string) => void;
  activeBackground: string;
  setActiveBackground: (bg: string) => void;
};

const TemplateContext = createContext<TemplateContextType | undefined>(undefined);

export function TemplateProvider({ children }: { children: ReactNode }) {
  const [activeTemplate, setActiveTemplate] = useState("Minimal");
  const [activeBackground, setActiveBackground] = useState("/backgrounds/wall1.png");
  return (
    <TemplateContext.Provider value={{ activeTemplate, setActiveTemplate, activeBackground, setActiveBackground }}>
      {children}
    </TemplateContext.Provider>
  );
}

export function useTemplate() {
  const context = useContext(TemplateContext);
  if (!context) throw new Error("useTemplate must be used within a TemplateProvider");
  return context;
}
