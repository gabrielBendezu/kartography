import { ToolType, ToolSettings } from './tools';

export interface MapContextType {
  activeTool: ToolType;
  toolSettings: ToolSettings;
  setActiveTool: (tool: ToolType) => void;
  setToolSettings: (tool: ToolType, settings: any) => void;
  getActiveToolSettings: () => any;
}