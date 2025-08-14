export type ToolType =
  | "select"
  | "terrain"
  | "brush"
  | "object"
  | "text"
  | "path"
  | "map_mode";

export type ToolSettings = Record<ToolType, any>;

export type SettingsForTool<T extends ToolType> = T extends "terrain"
  ? TerrainConfig
  : T extends "brush"
  ? BrushConfig
  : any;

export interface TerrainConfig {
  width: number;
  color: string;
  opacity: number;
  coastlineEffect?: {
    enabled: boolean;
    waveAmplitude: number;
    waveFrequency: number;
    fadeDistance: number;
  }
}
/*
  - Create a custom Konva shape that renders the terrain stroke with built-in coastline effects
  - Use Shape.sceneFunc() to draw the main terrain and add wavy edges using canvas operations
  - Apply different rendering for interior vs edge pixels
*/

export interface BrushConfig {
  width: number;
  color: string;
  opacity: number;
}

export interface BrushLine {
  // Make this more generic?
  tool: string;
  points: number[];
  color: string;
  width: number;
  opacity: number;
}

export interface ToolActionPayload {
  type: "tool_action";
  tool: ToolType;
  data: any;
  clientId?: string;
}
