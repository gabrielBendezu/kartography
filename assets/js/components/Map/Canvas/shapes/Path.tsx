import React, { JSX } from "react";
import { BrushLine, ToolType } from "../../../../types";
import { getToolHandlers } from "../../tools/toolRegistry";

interface PathProps {
  line: BrushLine;
}

const Path = ({ line }: PathProps): JSX.Element => {
  const toolConfig = getToolHandlers[line.tool as ToolType];
  const renderFunction = toolConfig?.renderFunction;
  
  if (renderFunction) {
    return renderFunction(line);
  }
  
  // Fallback to standard line if no render function is cached
  console.warn(`No render function found for tool: ${line.tool}`);
  return <></>;
};

export default Path;