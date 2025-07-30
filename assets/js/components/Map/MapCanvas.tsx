import React, { useEffect, useRef } from "react";
import * as fabric from "fabric";

import { useCanvas } from "../../hooks/useCanvas";
import FabricCanvas from "../Canvas/FabricCanvas.js";
import useChannelSync from "../../hooks/useChannelSync";
import { useMapContext } from "../../contexts/MapContext";

import { BrushConfig } from "./types";

import { Channel } from "phoenix";

const setupBrush = (canvas: fabric.Canvas, settings: BrushConfig) => {
  canvas.isDrawingMode = true;
  canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
  canvas.freeDrawingBrush.width = settings.width;
  canvas.freeDrawingBrush.color = settings.color;
  canvas.freeDrawingBrush.shadow = new fabric.Shadow({
    color: settings.color,
    blur: 0,
    offsetX: 0,
    offsetY: 0,
    affectStroke: true,
  });
  // Set brush opacity by adjusting the color alpha
  if (settings.opacity < 1) {
    const hex = settings.color.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    canvas.freeDrawingBrush.color = `rgba(${r}, ${g}, ${b}, ${settings.opacity})`;
  }
};

interface MapCanvasProps {
  channel: Channel;
}

const MapCanvas = ({ channel }: MapCanvasProps) => {
  const { brushSettings } = useMapContext();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // @ts-ignore for canvasRef thinking it has a null parameter
  const canvas: fabric.Canvas | null = useCanvas(canvasRef, {});

  useChannelSync(channel, canvas);

  useEffect(() => {
    if (!canvas) return;
    setupBrush(canvas, brushSettings);
    canvas.renderAll();
  }, [canvas, brushSettings]);

  return (
    <FabricCanvas
      ref={canvasRef}
      className="w-full h-full border border-base-300 cursor-crosshair focus:outline-2 focus:outline-info focus:outline-offset-2"
    />
  );
};

export default MapCanvas;
