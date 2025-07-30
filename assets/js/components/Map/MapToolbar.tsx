import React, { useState, useRef } from "react";

export type ToolType = "brush" | "eraser" | "select" | "image" | "text";

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

const MapToolbar = ({
  onToolChange,
  onBrushSettingsChange,
  onImageSelect,
}: MapToolbarProps) => {
  const [activeTool, setActiveTool] = useState<ToolType>("brush");
  const [brushSettings, setBrushSettings] = useState<BrushSettings>({
    width: 5,
    color: "#000000",
    opacity: 1,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleToolSelect = (tool: ToolType) => {
    setActiveTool(tool);
    onToolChange(tool);
  };

  const handleBrushChange = (
    key: keyof BrushSettings,
    value: number | string
  ) => {
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
      setActiveTool("image");
    }
  };

  return (
    <div className="flex flex-col w-16 min-h-full bg-base-200 border-r border-base-300 p-2 gap-2">
      {/* Tool Selection */}
      <div className="flex flex-col gap-1">
        <button
          className={`btn btn-square btn-md ${
            activeTool === "brush" ? "btn-primary" : "btn-ghost"
          }`}
          onClick={() => handleToolSelect("brush")}
        >
          Brush
        </button>
        <button
          className={`btn btn-square btn-md ${
            activeTool === "eraser" ? "btn-primary" : "btn-ghost"
          }`}
          onClick={() => handleToolSelect("eraser")}
        >
          Eraser
        </button>
        <button
          className={`btn btn-square btn-md ${
            activeTool === "select" ? "btn-primary" : "btn-ghost"
          }`}
          onClick={() => handleToolSelect("select")}
        >
          Select
        </button>
        <button
          className={`btn btn-square btn-md ${
            activeTool === "image" ? "btn-primary" : "btn-ghost"
          }`}
          onClick={handleImageClick}
        >
          Image
        </button>
      </div>

      {/* Brush Settings - Show when brush is active */}
      {activeTool === "brush" && (
        <div className="mt-4 pt-4 border-t border-base-300 flex flex-col gap-3">
          <div className="form-control">
            <label className="label py-1">
              <span className="label-text text-xs font-medium">Size:</span>
            </label>
            <input
              type="range"
              min="1"
              max="50"
              value={brushSettings.width}
              className="range range-primary range-xs"
              onChange={(e) =>
                handleBrushChange("width", parseInt(e.target.value))
              }
            />
            <span className="text-xs text-base-content/70 text-center mt-1">
              {brushSettings.width}px
            </span>
          </div>
          <div className="form-control">
            <label className="label py-1">
              <span className="label-text text-xs font-medium">Color:</span>
            </label>
            <input
              type="color"
              value={brushSettings.color}
              className="w-8 h-8 rounded border border-base-300 cursor-pointer mx-auto"
              onChange={(e) => handleBrushChange("color", e.target.value)}
            />
          </div>
          <div className="form-control">
            <label className="label py-1">
              <span className="label-text text-xs font-medium">Opacity:</span>
            </label>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.1"
              value={brushSettings.opacity}
              className="range range-primary range-xs"
              onChange={(e) =>
                handleBrushChange("opacity", parseFloat(e.target.value))
              }
            />
            <span className="text-xs text-base-content/70 text-center mt-1">
              {Math.round(brushSettings.opacity * 100)}%
            </span>
          </div>
        </div>
      )}

      {/* Hidden file input */}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        ref={fileInputRef}
      />
    </div>
  );
};

export default MapToolbar;
