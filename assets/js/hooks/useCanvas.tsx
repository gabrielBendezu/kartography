import { useEffect, useState, RefObject } from "react";
import * as fabric from "fabric";

interface CanvasOptions {
  width?: number;
  height?: number;
  backgroundColor?: string;
}

export const useCanvas = (
  canvasRef: RefObject<HTMLCanvasElement>,
  options: CanvasOptions = {}
): fabric.Canvas | null => {
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const fabricCanvas: fabric.Canvas = new fabric.Canvas(canvasRef.current, {
      width: options.width || 600,
      height: options.height || 400,
      backgroundColor: options.backgroundColor || "#002080",
    });

    setCanvas(fabricCanvas);

    return () => {
      fabricCanvas.dispose();
      setCanvas(null);
    };
  }, [canvasRef, options.width, options.height, options.backgroundColor]);

  return canvas;
};
