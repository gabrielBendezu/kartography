import React, { useEffect, useRef } from "react";
import * as fabric from "fabric";

import { useCanvas } from "../../hooks/useCanvas";
import FabricCanvas from "../Canvas/FabricCanvas.js";
import useChannelSync from "../../hooks/useChannelSync";

import styles from "./MapCanvas.module.css";

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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // @ts-ignore for canvasRef thinking it has a null parameter
  const canvas: fabric.Canvas | null = useCanvas(canvasRef, {});

  useChannelSync(channel, canvas);

  useEffect(() => {
    if (!canvas) return;
    setupBrush(canvas, {});
    canvas.renderAll();
  }, [canvas]);

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
