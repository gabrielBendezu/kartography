import { ToolType } from "../types";
import { brushTool } from "./brushTool";

export const getToolHandlers = (toolType: ToolType) => {
  switch (toolType) {
    case "brush":
      return brushTool;
    case "select":
    case "terrain":
    case "object":
    case "text":
    case "path":
    case "semantic_layer":
      // For now, return brush tool as fallback
      // You can implement these tools later
      return brushTool;
    default:
      return brushTool;
  }
};