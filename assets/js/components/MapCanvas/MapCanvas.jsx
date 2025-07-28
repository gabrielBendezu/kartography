/* eslint-disable react/prop-types */
import React, { useEffect, useRef } from 'react';
import * as fabric from 'fabric';

import { useCanvas } from "../../hooks/useCanvas.jsx"
import FabricCanvas from '../Canvas/FabricCanvas.jsx';
import useChannelSync from "../../hooks/useChannelSync";

const setupBrush = (canvas, options = {}) => {
  canvas.isDrawingMode = true;
  canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
  canvas.freeDrawingBrush.width = options.width || 5;
  canvas.freeDrawingBrush.color = options.color || "#000000"
};

const MapCanvas = ({ channel }) => {
  const canvasRef = useRef(null);
  const canvas = useCanvas(canvasRef, {})

  useEffect(() => {
    if (!canvas) return;

    setupBrush(canvas, {});
    canvas.renderAll();

    // Receive brush strokes
    channel.on("canvas_update", payload => {
      switch(payload.type) {
        case "brush_stroke":

          // Regular path handling - use SVG string if available, fallback to path array
          if (payload.data.pathString) {
            // Parse the complete SVG string to avoid truncation
            fabric.loadSVGFromString(payload.data.pathString).then(result => {
              const svgPath = result.objects[0];
              if (svgPath) {
                canvas.add(svgPath);
                canvas.renderAll();
              }
            });
          } else {
            // Fallback to path array (may be truncated)
            const path = new fabric.Path(payload.data.path, {
              stroke: payload.data.stroke,
              strokeWidth: payload.data.strokeWidth,
              fill: payload.data.fill
            });
            canvas.add(path);
            canvas.renderAll();
          }
          break;
      }

    });
  
    // Send brush strokes
    // TODO: Maybe make the mapcanvas have it's own shared state, including brush settings

    canvas.on("path:created", (e) => {      
      // Use the SVG path string instead of array to avoid truncation
      const pathString = e.path.toSVG();
      
      const pathData = {
        pathString: pathString,
        path: e.path.path,
        stroke: e.path.stroke,
        strokeWidth: e.path.strokeWidth,
        fill: e.path.fill
      };

      channel.push("canvas_draw", {
        type: "brush_stroke",
        data: pathData
      });
    });

    // Clean up when component unmounts
    return () => {
      channel.off("canvas_update");
    };
  }, [canvas, channel]);

  return (
    <div>
      <h3>Map Canvas</h3>
      <FabricCanvas ref={canvasRef} />   
    </div>
  );
};

export default MapCanvas;