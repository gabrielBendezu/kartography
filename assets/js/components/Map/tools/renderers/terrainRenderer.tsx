import React, { useEffect, useRef } from "react";
import { Line, Shape } from "react-konva";
import { BrushLine, TerrainConfig } from "../../../../types";
import { useTerrainMask } from "../../../../contexts/TerrainMaskContext";

const renderTerrainWithCoastline = (line: BrushLine): React.JSX.Element => {
  console.log("rendering with the special terrian thing");
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
          context.globalAlpha = 0.3;
          context.strokeStyle = 'rgba(0, 50, 100, 0.5)';
          context.lineWidth = line.width * 0.8;
          
          // Create wavy shadow effect
          const waveAmplitude = line.width * 0.3;
          const waveFrequency = 0.02;
          const shadowOffset = 3;
          
          context.beginPath();
          if (line.points.length >= 4) {
            context.moveTo(line.points[0] + shadowOffset, line.points[1] + shadowOffset);
            
            for (let i = 2; i < line.points.length; i += 2) {
              const x = line.points[i] + shadowOffset;
              const y = line.points[i + 1] + shadowOffset;
              const waveY = y + Math.sin(x * waveFrequency) * waveAmplitude;
              context.lineTo(x, waveY);
            }
            context.stroke();
          }
          
          // Create main wavy coastline
          context.globalAlpha = line.opacity;
          context.strokeStyle = line.color;
          context.lineWidth = line.width;
          
          context.beginPath();
          if (line.points.length >= 4) {
            context.moveTo(line.points[0], line.points[1]);
            
            for (let i = 2; i < line.points.length; i += 2) {
              const x = line.points[i];
              const y = line.points[i + 1];
              const waveY = y + Math.sin(x * waveFrequency) * waveAmplitude * 0.7;
              context.lineTo(x, waveY);
            }
            context.stroke();
          }
        }
        
        context.fillStrokeShape(shape);
      }}
    />
  );
};

const renderTerrainStandard = (line: BrushLine): React.JSX.Element => {
  const { addTerrainMask } = useTerrainMask();
  const addedRef = useRef(false);

  useEffect(() => {
    if (!addedRef.current) {
      const maskId = `terrain-${line.points.join('-')}`;
      addTerrainMask({
        id: maskId,
        points: line.points,
        width: line.width
      });
      addedRef.current = true;
    }
  }, [line.points, line.width, addTerrainMask]);

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