import React, { useEffect, useRef } from "react";
import { Line, Shape } from "react-konva";
import { BrushLine, TerrainConfig } from "../../../../types";
import { useTerrainMask } from "../../../../contexts/TerrainMaskContext";

const renderTerrainWithCoastline = (line: BrushLine): React.JSX.Element => {
  const { addTerrainMask } = useTerrainMask();
  const addedRef = useRef(false);

  useEffect(() => {
    if (!addedRef.current) {
      const maskId = `terrain-coastline-${line.points.join('-')}`;
      addTerrainMask({
        id: maskId,
        points: line.points,
        width: line.width
      });
      addedRef.current = true;
    }
  }, [line.points, line.width, addTerrainMask]);

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
          
          // Apply coastline effects using Konva composite operations
          context.save();
          
          // Create shadow/depth effect
          context.globalCompositeOperation = "multiply";
          context.shadowColor = "rgba(0, 30, 60, 0.6)";
          context.shadowBlur = line.width * 0.5;
          context.shadowOffsetX = 2;
          context.shadowOffsetY = 2;
          
          // Draw the base coastline with shadow
          context.beginPath();
          context.moveTo(line.points[0], line.points[1]);
          for (let i = 2; i < line.points.length; i += 2) {
            context.lineTo(line.points[i], line.points[i + 1]);
          }
          context.strokeStyle = line.color;
          context.lineWidth = line.width;
          context.stroke();
          
          // Add foam/wave effect with overlay
          context.globalCompositeOperation = "overlay";
          context.shadowColor = "transparent";
          context.strokeStyle = "rgba(255, 255, 255, 0.4)";
          context.lineWidth = line.width * 0.3;
          
          // Create organic wave pattern using quadratic curves
          context.beginPath();
          if (line.points.length >= 4) {
            context.moveTo(line.points[0], line.points[1]);
            
            for (let i = 2; i < line.points.length - 2; i += 2) {
              const cpX = (line.points[i] + line.points[i + 2]) / 2;
              const cpY = (line.points[i + 1] + line.points[i + 3]) / 2;
              
              // Add slight wave variation
              const waveOffset = Math.sin(i * 0.5) * (line.width * 0.1);
              context.quadraticCurveTo(
                line.points[i], 
                line.points[i + 1] + waveOffset,
                cpX, 
                cpY
              );
            }
            context.stroke();
          }
          
          context.restore();
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