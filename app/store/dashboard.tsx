import { createContext, useState, type ReactNode } from "react";

export type DashboardConfig = {
  people: number;
  targetDays: number;
  onePersonOneDayCalories: number;
};

type DashboardContextType = {
  config: DashboardConfig;
  updateConfig: (newConfig: Partial<DashboardConfig>) => void;
};

const defaultSetting: DashboardConfig = {
  people: 1,
  targetDays: 30,
  onePersonOneDayCalories: 2000,
};

export const DashboardContext = createContext<DashboardContextType>({
  config: defaultSetting,
  updateConfig: () => {},
});

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<DashboardConfig>(defaultSetting);
  // 一樣可以在這裡做 localStorage 的初始化與儲存...
  const updateConfig = (newConfig: Partial<DashboardConfig>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }));
  };
  return (
    <DashboardContext.Provider value={{ config, updateConfig }}>
      {children}
    </DashboardContext.Provider>
  );
}