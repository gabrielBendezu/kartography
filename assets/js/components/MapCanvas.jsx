import React, { useEffect, useRef } from 'react';
import * as fabric from 'fabric';

const MapCanvas = ({ channel }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Create a simple Fabric.js canvas
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 600,
      height: 400,
      backgroundColor: '#0099FF'
    });
    
    canvas.renderAll();

    channel.on("canvas_update", payload => {
      // Handle canvas updates from other users
    });

    // Clean up when component unmounts
    return () => {
      canvas.dispose();
      channel.off("canvas_update");
    };
  }, []);

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