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

    // Get container dimensions (parent element)
    const containerElement = canvasRef.current.parentElement;
    const containerWidth = containerElement?.offsetWidth || 600;
    const containerHeight = containerElement?.offsetHeight || 400;

    const fabricCanvas: fabric.Canvas = new fabric.Canvas(canvasRef.current, {
      width: options.width || containerWidth,
      height: options.height || containerHeight,
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
