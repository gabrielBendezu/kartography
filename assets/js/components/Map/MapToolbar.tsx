import React, { useState, useRef } from 'react';

export type ToolType = 'brush' | 'eraser' | 'select' | 'image' | 'text';

interface BrushSettings {
  width: number;
  color: string;
  opacity: number;
}

interface MapToolbarProps {
  onToolChange: (tool: ToolType) => void;
  onBrushSettingsChange: (settings: BrushSettings) => void;
  onImageSelect: (file: File) => void;
}

const MapToolbar = ({ onToolChange, onBrushSettingsChange, onImageSelect }: MapToolbarProps) => {
  const [activeTool, setActiveTool] = useState<ToolType>('brush');
  const [brushSettings, setBrushSettings] = useState<BrushSettings>({
    width: 5,
    color: '#000000',
    opacity: 1
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleToolSelect = (tool: ToolType) => {
    setActiveTool(tool);
    onToolChange(tool);
  };

  const handleBrushChange = (key: keyof BrushSettings, value: number | string) => {
    const newSettings = { ...brushSettings, [key]: value };
    setBrushSettings(newSettings);
    onBrushSettingsChange(newSettings);
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageSelect(file);
      setActiveTool('image');
    }
  };

  return (
    <div className="map-toolbar">
      {/* Tool Selection */}
      <div className="map-tool-group">
        <button 
          className={`map-tool-button ${activeTool === 'brush' ? 'active' : ''}`}
          onClick={() => handleToolSelect('brush')}
        >
          Brush
        </button>
        <button 
          className={`map-tool-button ${activeTool === 'eraser' ? 'active' : ''}`}
          onClick={() => handleToolSelect('eraser')}
        >
          Eraser
        </button>
        <button 
          className={`map-tool-button ${activeTool === 'select' ? 'active' : ''}`}
          onClick={() => handleToolSelect('select')}
        >
          Select
        </button>
        <button 
          className={`map-tool-button ${activeTool === 'image' ? 'active' : ''}`}
          onClick={handleImageClick}
        >
          Image
        </button>
      </div>

      {/* Brush Settings - Show when brush is active */}
      {activeTool === 'brush' && (
        <div className="map-tool-settings">
          <label className="map-tool-setting">
            Size:
            <input
              type="range"
              min="1"
              max="50"
              value={brushSettings.width}
              onChange={(e) => handleBrushChange('width', parseInt(e.target.value))}
            />
            <span>{brushSettings.width}px</span>
          </label>
          <label className="map-tool-setting">
            Color:
            <input
              type="color"
              value={brushSettings.color}
              onChange={(e) => handleBrushChange('color', e.target.value)}
            />
          </label>
          <label className="map-tool-setting">
            Opacity:
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.1"
              value={brushSettings.opacity}
              onChange={(e) => handleBrushChange('opacity', parseFloat(e.target.value))}
            />
            <span>{Math.round(brushSettings.opacity * 100)}%</span>
          </label>
        </div>
      )}

      {/* Hidden file input */}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        ref={fileInputRef}
      />
    </div>
  );
};

export default MapToolbar;
