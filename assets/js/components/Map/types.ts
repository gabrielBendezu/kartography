export type ToolType = "select" | "terrain" | "brush" | "object" | "text" | "path" | "map_mode";

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
