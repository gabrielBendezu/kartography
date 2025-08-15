import React, { createContext, useContext, useState } from "react";
import { ToolType, ToolSettings } from "../types";
import {
  getToolHandlers,
  getDefaultSettingsForTool,
  updateToolRenderer,
} from "../components/Map/tools/toolRegistry";

interface MapContextType {
  activeTool: ToolType;
  toolSettings: ToolSettings;
  setActiveTool: (tool: ToolType) => void;
  setToolSettings: (tool: ToolType, settings: any) => void;
  getActiveToolSettings: () => any;
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
  const [activeTool, setActiveTool] = useState<ToolType>("terrain");

  // Initialize with defaults for all tools
  const [toolSettings, setToolSettings] = useState<ToolSettings>(() => {
    const settings: ToolSettings = {} as ToolSettings;
    Object.keys(getToolHandlers).forEach((tool) => {
      const defaultSettings = getDefaultSettingsForTool(tool as ToolType);
      if (defaultSettings) {
        settings[tool as ToolType] = defaultSettings;
        // Initialize render functions for each tool
        updateToolRenderer(tool as ToolType, defaultSettings);
      }
    });
    return settings;
  });

  const updateToolSettings = (tool: ToolType, newSettings: any) => {
    setToolSettings((prev) => ({
      ...prev,
      [tool]: newSettings,
    }));
    
    // Update the tool's render function when settings change
    updateToolRenderer(tool, newSettings);
  };

  const getActiveToolSettings = () => toolSettings[activeTool];

  const value = {
    activeTool,
    toolSettings,
    setActiveTool,
    setToolSettings: updateToolSettings,
    getActiveToolSettings,
  };

  return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
};
