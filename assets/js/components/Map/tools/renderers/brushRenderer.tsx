import React from "react";
import { Shape } from "react-konva";
import { BrushLine, BrushConfig } from "../../../../types";
import { useTerrainMask } from "../../../../contexts/TerrainMaskContext";

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
  const { terrainMasks } = useTerrainMask();

  return (
    <Shape
      key={`brush-masked-${line.points.join('-')}`}
      sceneFunc={(context, shape) => {
        if (line.points.length < 4) return;

        context.beginPath();
        
        // Create clipping path from terrain masks
        if (terrainMasks.length > 0) {
          terrainMasks.forEach(mask => {
            if (mask.points.length >= 4) {
              context.moveTo(mask.points[0], mask.points[1]);
              for (let i = 2; i < mask.points.length; i += 2) {
                context.lineTo(mask.points[i], mask.points[i + 1]);
              }
              context.lineWidth = mask.width;
              context.lineCap = "round";
              context.lineJoin = "round";
            }
          });
          context.clip();
        }

        // Draw brush stroke only within clipped area
        context.beginPath();
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
        
        context.fillStrokeShape(shape);
      }}
    />
  );
};

export const getBrushRenderer = (_settings: BrushConfig): ((line: BrushLine) => React.JSX.Element) => {
  // Check for texture effects when implemented
  // if (settings.textureEffect?.enabled) {
  //   return renderBrushWithTexture;
  // }
  return renderBrushStandard;
};