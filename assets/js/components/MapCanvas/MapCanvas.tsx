import React, { useEffect, useRef } from "react";
import * as fabric from "fabric";

import { useCanvas } from "../../hooks/useCanvas";
import FabricCanvas from "../Canvas/FabricCanvas.js";
import useChannelSync from "../../hooks/useChannelSync";

import { Channel } from "phoenix";

const setupBrush = (
  canvas: fabric.Canvas,
  options: { width?: number; color?: string } = {}
) => {
  canvas.isDrawingMode = true;
  canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
  canvas.freeDrawingBrush.width = options.width || 5;
  canvas.freeDrawingBrush.color = options.color || "#000000";
};

interface MapCanvasProps {
  channel: Channel;
}

const MapCanvas = ({ channel }: MapCanvasProps) => {
  const canvasRef = useRef(null);
  const canvas: fabric.Canvas | null = useCanvas(canvasRef, {});

  useChannelSync(channel, canvas);

  useEffect(() => {
    if (!canvas) return;
    setupBrush(canvas, {});
    canvas.renderAll();
  }, [canvas]);

  return (
    <div>
      <h3>Map Canvas</h3>
      <FabricCanvas ref={canvasRef} />
    </div>
  );
};

export default MapCanvas;
