import React, { useEffect, useRef } from 'react';
import * as fabric from 'fabric';

const setupBrush = (canvas, options = {}) => {
  canvas.isDrawingMode = true;
  canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
  canvas.freeDrawingBrush.width = options.width || 5;
  canvas.freeDrawingBrush.color = options.color || "#000000"
};

const MapCanvas = ({ channel }) => {
  const canvasRef = useRef(null);
  const canvasInstanceRef = useRef(null);

  useEffect(() => {
    // Create a simple Fabric.js canvas
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 600,
      height: 400,
      backgroundColor: '#002080'
    })

    canvasInstanceRef.current = canvas;
    setupBrush(canvas, {});
    
    //canvas.renderAll();

    // Receive brush strokes
    channel.on("canvas_update", payload => {
      switch(payload.type) {
        case "brush_stroke":
          const path = new fabric.Path(payload.data.path, {
            stroke: payload.data.stroke,
            strokeWidth: payload.data.strokeWidth,
            fill: payload.data.fill
          });
          canvas.add(path);
          canvas.renderAll();
          //break;
      }

    });

    // Send brush strokes
    // TODO: Maybe the channel(or a separate thing) should keep some mapcanvas data for everyone, which includes
    // everyones current brush settings, such that the brush settings are always communicated when they are set by someone
    // and not everytime someone draws.
    canvas.on("path:created", (e) => {
      const pathData = {
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
      canvas.dispose();
      channel.off("canvas_update");
    };
  }, [channel]);

  return (
    <div>
      <h3>Map Canvas</h3>
      <canvas 
        ref={canvasRef} 
        style={{ border: '1px solid #000', display: 'block' }}
      />
    </div>
  );
};

export default MapCanvas;