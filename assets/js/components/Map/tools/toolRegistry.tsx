import React from "react";
import { ToolType, BrushLine } from "../../../types/types";
import brushTool from "./brushTool";
import terrainTool from "./terrainTool";
import { BrushSettings, TerrainSettings } from "../Toolbar";
import { getTerrainRenderer } from "./renderers/terrainRenderer";
import { getBrushRenderer } from "./renderers/brushRenderer";

interface ToolConfig {
  handlers?: any;
  settings?: React.ComponentType<any>;
  defaultSettings?: any;
  renderFunction?: (line: any) => React.JSX.Element;
}

export const getToolHandlers: Record<ToolType, ToolConfig> = {
  select: {},
  terrain: {
    handlers: terrainTool,
    settings: TerrainSettings,
    defaultSettings: { color: "#668866", width: 60, opacity: 1 },
  },
  brush: {
    handlers: brushTool,
    settings: BrushSettings,
    defaultSettings: { color: "#119900", width: 40, opacity: 1 },
  },
  text: {},
  path: {},
  object: {},
  map_mode: {},
};

export const getDefaultSettingsForTool = (tool: ToolType) =>
  getToolHandlers[tool].defaultSettings;

export const getSettingsComponentForTool = (tool: ToolType) =>
  getToolHandlers[tool].settings;

// Determine which renderer to use based on tool and settings
export const determineRenderer = (tool: ToolType, settings: any): ((line: BrushLine) => React.JSX.Element) => {
  switch (tool) {
    case "terrain":
      return getTerrainRenderer(settings);
      
    case "brush":
      return getBrushRenderer(settings);
      
    default:
      // Fallback for other tools - return empty fragment
      return () => <></>;
  }
};

// Update a tool's render function
export const updateToolRenderer = (tool: ToolType, settings: any) => {
  const toolConfig = getToolHandlers[tool];
  if (toolConfig) {
    toolConfig.renderFunction = determineRenderer(tool, settings);
  }
};
