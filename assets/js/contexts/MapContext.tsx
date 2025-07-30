import React, { createContext, useContext, useState } from "react";
import { ToolType } from "../components/Map/MapToolbar";
import { BrushConfig } from "../components/Map/types";

interface MapContextType {
  activeTool: ToolType;
  brushSettings: BrushConfig;
  setActiveTool: (tool: ToolType) => void;
  setBrushSettings: (settings: BrushConfig) => void;
}

const MapContext = createContext<MapContextType | undefined>(undefined);

export const useMapContext = () => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error("useMapContext must be used within a MapContextProvider");
  }
  return context;
};

interface MapContextProviderProps {
  children: React.ReactNode;
}

export const MapContextProvider = ({ children }: MapContextProviderProps) => {
  const [activeTool, setActiveTool] = useState<ToolType>("brush");
  const [brushSettings, setBrushSettings] = useState<BrushConfig>({
    width: 5,
    color: "#000000",
    opacity: 1,
  });

  const value = {
    activeTool,
    brushSettings,
    setActiveTool,
    setBrushSettings,
  };

  return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
};