import React from "react";
import { Line, Shape } from "react-konva";
import { BrushLine, BrushConfig } from "../../../../types";

const renderBrushWithTexture = (line: BrushLine): React.JSX.Element => {
  return (
    <Shape
      key={`brush-texture-${line.points.join('-')}`}
      sceneFunc={(context, shape) => {
        context.beginPath();
        
        // Draw base stroke with texture effects
        if (line.points.length >= 4) {
          context.moveTo(line.points[0], line.points[1]);
          
          for (let i = 2; i < line.points.length; i += 2) {
            context.lineTo(line.points[i], line.points[i + 1]);
          }
          
          context.strokeStyle = line.color;
          context.lineWidth = line.width;
          context.globalAlpha = line.opacity;
          context.lineCap = "round";
          context.lineJoin = "round";
          context.stroke();
          
          // Apply texture patterns (grass, dirt, etc.)
          // TODO: Implement texture patterns here
          // - Add randomized stippling for organic textures
          // - Create pattern overlays based on brush type
          // - Apply opacity variations for depth
        }
        
        context.fillStrokeShape(shape);
      }}
    />
  );
};

const renderBrushStandard = (line: BrushLine): React.JSX.Element => {
  return (
    <Line
      key={`brush-standard-${line.points.join('-')}`}
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

export const getBrushRenderer = (settings: BrushConfig): ((line: BrushLine) => React.JSX.Element) => {
  // Check for texture effects when implemented
  // if (settings.textureEffect?.enabled) {
  //   return renderBrushWithTexture;
  // }
  return renderBrushStandard;
};