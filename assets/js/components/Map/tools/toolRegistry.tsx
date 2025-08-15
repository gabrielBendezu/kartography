import React from "react";
import { ToolType, BrushLine } from "../../../types";
import brushTool from "./brushTool";
import terrainTool from "./terrainTool";
import { BrushSettings, TerrainSettings } from "../Toolbar";
import { getTerrainRenderer } from "./renderers/terrainRenderer";
import { getBrushRenderer } from "./renderers/brushRenderer";
import Konva from "konva";

interface ToolConfig {
  handlers?: any; // Add ToolHandlers interface here.
  settings?: React.ComponentType<any>;
  defaultSettings?: any;
  renderFunction?: (line: any) => React.JSX.Element;
}

export const getToolHandlers: Record<ToolType, ToolConfig> = {
  select: {},
  terrain: {
    handlers: terrainTool,
    settings: TerrainSettings,
    defaultSettings: { color: "#668866", width: 100, opacity: 1 },
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

// TODO: make the tools utilise this from here
const getPointerPosition = (
  event: Konva.KonvaEventObject<MouseEvent | TouchEvent>
): Konva.Vector2d | null => {
  const stage = event.target.getStage();
  if (!stage) {
    console.warn("Stage not found", event);
    return null;
  }
  const position = stage.getPointerPosition();
  if (!position) {
    console.warn("Position unavailable");
    return null;
  }
  return position;
};
