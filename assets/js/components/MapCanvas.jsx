import React, { useEffect, useRef } from 'react';
import * as fabric from 'fabric';

const MapCanvas = ({ channel }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Create a simple Fabric.js canvas
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 600,
      height: 400,
      backgroundColor: '#0000FF'
    });

    // Clean up when component unmounts
    return () => {
      canvas.dispose();
    };
  }, []);

  return (
    <div>
      <h3>Map Canvas</h3>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default MapCanvas;