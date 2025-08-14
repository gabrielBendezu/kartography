import React from "react";
import { Line, Shape } from "react-konva";
import { ToolType, BrushLine, TerrainConfig, BrushConfig } from "../../../types/types";
import brushTool from "./brushTool";
import terrainTool from "./terrainTool";
import { BrushSettings, TerrainSettings } from "../ToolbarSettings";

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

// Renderer functions for different brushstroke types
const renderStandardLine = (line: BrushLine): React.JSX.Element => {
  return (
    <Line
      key={`line-${line.points.join('-')}`}
      points={line.points}
      stroke={line.color}
      strokeWidth={line.width}
      opacity={line.opacity}
      tension={0.5}
      lineCap="round"
      lineJoin="round"
      globalCompositeOperation={
        line.tool === "eraser" ? "destination-out" : "source-over"
      }
    />
  );
};

const renderTerrainShape = (line: BrushLine): React.JSX.Element => {
  return (
    <Shape
      key={`terrain-${line.points.join('-')}`}
      sceneFunc={(context, shape) => {
        // Draw main terrain stroke
        // Apply coastline wave effects on edges
        // Blend with marine background
      }}
    />
  );
};

const renderBrushShape = (line: BrushLine): React.JSX.Element => {
  return (
    <Shape
      key={`brush-${line.points.join('-')}`}
      sceneFunc={(context, shape) => {
        // Draw base stroke
        // Apply texture patterns (grass, dirt, etc.)
      }}
    />
  );
};

// Determine which renderer to use based on tool and settings
export const determineRenderer = (tool: ToolType, settings: any): ((line: BrushLine) => React.JSX.Element) => {
  switch (tool) {
    case "terrain":
      const terrainSettings = settings as TerrainConfig;
      if (terrainSettings?.coastlineEffect?.enabled) {
        return renderTerrainShape;
      }
      return renderStandardLine;
      
    case "brush":
      const brushSettings = settings as BrushConfig;
      // Check for texture effects here when implemented
      // if (hasTextureEffects(brushSettings)) {
      //   return renderBrushShape;
      // }
      return renderStandardLine;
      
    default:
      return renderStandardLine;
  }
};

// Update a tool's render function
export const updateToolRenderer = (tool: ToolType, settings: any) => {
  const toolConfig = getToolHandlers[tool];
  if (toolConfig) {
    toolConfig.renderFunction = determineRenderer(tool, settings);
  }
};
