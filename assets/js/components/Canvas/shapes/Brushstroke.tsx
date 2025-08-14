import React, { JSX } from "react";
import { BrushLine, ToolType } from "../../../types/types";
import { getToolHandlers } from "../../Map/tools/toolRegistry";

interface BrushStrokeProps {
  line: BrushLine;
}

const BrushStroke = ({ line }: BrushStrokeProps): JSX.Element => {
  const toolConfig = getToolHandlers[line.tool as ToolType];
  const renderFunction = toolConfig?.renderFunction;
  
  if (renderFunction) {
    return renderFunction(line);
  }
  
  // Fallback to standard line if no render function is cached
  console.warn(`No render function found for tool: ${line.tool}`);
  return <></>;
};

export default BrushStroke;
