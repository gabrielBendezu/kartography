import React, { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';

const MapCanvas = ({ channel }) => {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  
  useEffect(() => {
    // Initialize Fabric canvas
    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: '#f0f0f0'
    });
    
    // Set up the drawing brush
    fabricCanvas.isDrawingMode = false;
    fabricCanvas.freeDrawingBrush.width = 5;
    fabricCanvas.freeDrawingBrush.color = '#000000';
    
    // Add a background layer (example: grid pattern)
    const gridSize = 50;
    const gridGroup = new fabric.Group([], {
      selectable: false,
      evented: false,
      excludeFromExport: true
    });
    
    // Create grid lines
    for (let i = 0; i <= 800; i += gridSize) {
      gridGroup.addWithUpdate(new fabric.Line([i, 0, i, 600], {
        stroke: '#ddd',
        strokeWidth: 1,
        selectable: false,
        evented: false
      }));
    }
    
    for (let i = 0; i <= 600; i += gridSize) {
      gridGroup.addWithUpdate(new fabric.Line([0, i, 800, i], {
        stroke: '#ddd',
        strokeWidth: 1,
        selectable: false,
        evented: false
      }));
    }
    
    fabricCanvas.add(gridGroup);
    fabricCanvas.sendToBack(gridGroup);
    
    // Listen for path created events (when drawing is complete)
    fabricCanvas.on('path:created', (e) => {
      const path = e.path;
      const pathData = {
        type: 'path',
        path: path.path,
        color: path.stroke,
        width: path.strokeWidth
      };
      
      // Send drawing data through Phoenix channel
      if (channel) {
        channel.push('draw', { data: pathData });
      }
    });
    
    setCanvas(fabricCanvas);
    
    // Set up channel listeners
    if (channel) {
      const drawRef = channel.on('draw', (payload) => {
        // Recreate path from received data
        const path = new fabric.Path(payload.data.path, {
          stroke: payload.data.color,
          strokeWidth: payload.data.width,
          fill: null,
          selectable: false
        });
        fabricCanvas.add(path);
      });
      
      return () => {
        channel.off('draw', drawRef);
        fabricCanvas.dispose();
      };
    }
    
    return () => {
      fabricCanvas.dispose();
    };
  }, [channel]);
  
  const toggleDrawing = () => {
    if (canvas) {
      canvas.isDrawingMode = !canvas.isDrawingMode;
      setIsDrawing(!isDrawing);
    }
  };
  
  const clearCanvas = () => {
    if (canvas) {
      // Remove all objects except the background grid
      const objects = canvas.getObjects();
      objects.forEach(obj => {
        if (!obj.excludeFromExport) {
          canvas.remove(obj);
        }
      });
      canvas.renderAll();
      
      // Notify other users through channel
      if (channel) {
        channel.push('clear', {});
      }
    }
  };
  
  const changeColor = (color) => {
    if (canvas) {
      canvas.freeDrawingBrush.color = color;
    }
  };
  
  const changeBrushSize = (size) => {
    if (canvas) {
      canvas.freeDrawingBrush.width = parseInt(size);
    }
  };
  
  // Listen for clear events from other users
  useEffect(() => {
    if (channel && canvas) {
      const clearRef = channel.on('clear', () => {
        const objects = canvas.getObjects();
        objects.forEach(obj => {
          if (!obj.excludeFromExport) {
            canvas.remove(obj);
          }
        });
        canvas.renderAll();
      });
      
      return () => {
        channel.off('clear', clearRef);
      };
    }
  }, [channel, canvas]);
  
  return (
    <div className="p-4">
      <div className="mb-4 flex gap-4 items-center">
        <button
          onClick={toggleDrawing}
          className={`px-4 py-2 rounded ${
            isDrawing 
              ? 'bg-red-500 hover:bg-red-600 text-white' 
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          {isDrawing ? 'Stop Drawing' : 'Start Drawing'}
        </button>
        
        <button
          onClick={clearCanvas}
          className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded"
        >
          Clear Canvas
        </button>
        
        <div className="flex items-center gap-2">
          <label>Color:</label>
          <input
            type="color"
            onChange={(e) => changeColor(e.target.value)}
            className="w-10 h-10 border rounded cursor-pointer"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <label>Brush Size:</label>
          <input
            type="range"
            min="1"
            max="50"
            defaultValue="5"
            onChange={(e) => changeBrushSize(e.target.value)}
            className="w-32"
          />
        </div>
      </div>
      
      <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
};

export default MapCanvas;