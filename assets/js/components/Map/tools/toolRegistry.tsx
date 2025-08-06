import React from "react";
import { ToolType } from "../types";
import brushTool from "./brushTool";
import terrainTool from "./terrainTool";
import { BrushSettings, TerrainSettings } from "../ToolbarSettings";

interface ToolConfig {
  handlers?: any;
  settings?: React.ComponentType<any>;
  defaultSettings?: any;
}

export const getToolHandlers: Record<ToolType, ToolConfig> = {
  select: {},
  terrain: {
    handlers: terrainTool,
    settings: TerrainSettings,
    defaultSettings: { color: "#0F0", width: 20, opacity: 1 },
  },
  brush: {
    handlers: brushTool,
    settings: BrushSettings,
    defaultSettings: { color: "#000", width: 10, opacity: 1 },
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
