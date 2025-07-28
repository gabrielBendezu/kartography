// components/Canvas/FabricCanvas.jsx
import React, { forwardRef } from 'react';

const FabricCanvas = forwardRef(({ 
  width = 600, 
  height = 400, 
  backgroundColor = '#002080',
  className = '',
  style = {},
  ...rest 
}, ref) => {
  return (
    <canvas 
      ref={ref}
      width={width}
      height={height}
      className={className}
      style={{
        border: '1px solid #ccc',
        display: 'block',
        ...style
      }}
      {...rest}
    />
  );
});

FabricCanvas.displayName = 'FabricCanvas';

export default FabricCanvas;