import React from "react";
import { ToolType } from "../types";
import { brushTool } from "./brushTool";
import { BrushSettings } from "../ToolbarSettings";

interface ToolConfig {
  handlers?: any;
  settings?: React.ComponentType<any>;
  defaultSettings?: any;
}

export const getToolHandlers: Record<ToolType, ToolConfig> = {
  select: {
    // handlers: brushTool,
    // settings: BrushSettings, // Component
    // defaultSettings: { color: "#000", width: 5, opacity: 1 },
  },
  terrain: {
    // handlers: brushTool,
    // settings: BrushSettings, // Component
    // defaultSettings: { color: "#000", width: 5, opacity: 1 },
  },
  brush: {
    handlers: brushTool,
    settings: BrushSettings, // Component
    defaultSettings: { color: "#000", width: 5, opacity: 1 },
  },
  text: {
    // handlers: brushTool,
    // settings: BrushSettings, // Component
    // defaultSettings: { color: "#000", width: 5, opacity: 1 },
  },
  path: {
    // handlers: brushTool,
    // settings: BrushSettings, // Component
    // defaultSettings: { color: "#000", width: 5, opacity: 1 },
  },
  object: {
    // handlers: brushTool,
    // settings: BrushSettings, // Component
    // defaultSettings: { color: "#000", width: 5, opacity: 1 },
  },
  map_mode: {
    // handlers: brushTool,
    // settings: BrushSettings, // Component
    // defaultSettings: { color: "#000", width: 5, opacity: 1 },
  }
};
