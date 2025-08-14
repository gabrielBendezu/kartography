import React from "react";
import { Line, Shape } from "react-konva";
import { BrushLine, TerrainConfig } from "../../../../types/types";

const renderTerrainWithCoastline = (line: BrushLine): React.JSX.Element => {
  return (
    <Shape
      key={`terrain-coastline-${line.points.join('-')}`}
      sceneFunc={(context, shape) => {
        context.beginPath();
        
        // Draw main terrain stroke
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
          
          // Apply coastline wave effects on edges
          // TODO: Implement wave effects here
          // - Create wavy edges using bezier curves
          // - Blend with marine background
        }
        
        context.fillStrokeShape(shape);
      }}
    />
  );
};

const renderTerrainStandard = (line: BrushLine): React.JSX.Element => {
  return (
    <Line
      key={`terrain-standard-${line.points.join('-')}`}
      points={line.points}
      stroke={line.color}
      strokeWidth={line.width}
      opacity={line.opacity}
      tension={0.5}
      lineCap="round"
      lineJoin="round"
      globalCompositeOperation="source-over"
    />
  );
};

export const getTerrainRenderer = (settings: TerrainConfig): ((line: BrushLine) => React.JSX.Element) => {
  if (settings.coastlineEffect?.enabled) {
    return renderTerrainWithCoastline;
  }
  return renderTerrainStandard;
};