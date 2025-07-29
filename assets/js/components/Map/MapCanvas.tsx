import React, { useEffect, useRef } from "react";
import * as fabric from "fabric";

import { useCanvas } from "../../hooks/useCanvas";
import FabricCanvas from "../Canvas/FabricCanvas.js";
import useChannelSync from "../../hooks/useChannelSync";

import styles from "./MapCanvas.module.css";

import { Channel } from "phoenix";

interface BrushSettings {
  width: number;
  color: string;
  opacity: number;
}

const setupBrush = (
  canvas: fabric.Canvas,
  settings: BrushSettings
) => {
  canvas.isDrawingMode = true;
  canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
  canvas.freeDrawingBrush.width = settings.width;
  canvas.freeDrawingBrush.color = settings.color;
  canvas.freeDrawingBrush.shadow = new fabric.Shadow({
    color: settings.color,
    blur: 0,
    offsetX: 0,
    offsetY: 0,
    affectStroke: true
  });
  // Set brush opacity by adjusting the color alpha
  if (settings.opacity < 1) {
    const hex = settings.color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    canvas.freeDrawingBrush.color = `rgba(${r}, ${g}, ${b}, ${settings.opacity})`;
  }
};

interface MapCanvasProps {
  channel: Channel;
  brushSettings: BrushSettings;
}

const MapCanvas = ({ channel, brushSettings }: MapCanvasProps) => {
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
    <div className={styles.mapCanvas}>
      <h3 className={styles.canvasTitle}>Map Canvas</h3>
      <div className={styles.canvasContainer}>
        <FabricCanvas ref={canvasRef} className={styles.fabricCanvas} />
      </div>
    </div>
  );
};

export default MapCanvas;
