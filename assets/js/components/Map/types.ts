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
}

export interface BrushConfig {
  width: number;
  color: string;
  opacity: number;
}

export interface BrushLine {
  tool: string;
  points: number[];
  color: string;
  width: number;
  opacity: number;
}

export interface BrushSettingsProps {
  settings: BrushConfig;
  onChange: (field: keyof BrushConfig, value: number | string) => void;
}

export interface ToolActionPayload {
  type: "tool_action";
  tool: ToolType;
  data: any;
  clientId?: string;
}
