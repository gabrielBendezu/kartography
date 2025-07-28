import { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';

export const useCanvas = (canvasRef, options = {}) => {
  const [canvas, setCanvas] = useState(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      width: options.width || 600,
      height: options.height || 400,
      backgroundColor: options.backgroundColor || '#002080'
    });

    setCanvas(fabricCanvas);

    return () => {
      fabricCanvas.dispose();
      setCanvas(null);
    };
  }, []); 

  return canvas
};