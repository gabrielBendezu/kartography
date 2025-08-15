import Konva from "konva";
import { BrushLine } from "./canvas";
import { Channel } from "phoenix";

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
  };
}

export interface BrushConfig {
  width: number;
  color: string;
  opacity: number;
}

export interface ToolActionPayload {
  type: "tool_action";
  tool: ToolType;
  data: any;
  clientId?: string;
}

// TODO: use this interface for all the tools.
interface ToolHandlers {
  handleMouseDown: (
    event: Konva.KonvaEventObject<MouseEvent | TouchEvent>,
    settings: any,
    lines: BrushLine[],
    setLines: React.Dispatch<React.SetStateAction<BrushLine[]>>
  ) => void;

  handleMouseMove: (
    event: Konva.KonvaEventObject<MouseEvent | TouchEvent>,
    lines: BrushLine[],
    setLines: React.Dispatch<React.SetStateAction<BrushLine[]>>
  ) => void;

  handleMouseUp: (channel: Channel, lines: BrushLine[]) => void;

  handleReceiveAction: (
    data: any,
    lines: BrushLine[],
    setLines: React.Dispatch<React.SetStateAction<BrushLine[]>>
  ) => void;
}
