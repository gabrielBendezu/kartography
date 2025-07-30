import React, { useState, useRef } from "react";
import ToolSettings from "./ToolSettings";
import BrushSettings from "./ToolBarSettings/BrushSettings";
import { useMapContext } from "../../contexts/MapContext";

export type ToolType = "brush" | "eraser" | "select" | "image" | "text";

const MapToolbar = () => {
  const { activeTool, setActiveTool } = useMapContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showSettings, setShowSettings] = useState(false);
  const [settingsPosition, setSettingsPosition] = useState({ x: 0, y: 0 });
  const toolbarRef = useRef<HTMLDivElement>(null);
  
  const handleToolClick = (tool: ToolType, event: React.MouseEvent) => {
    setActiveTool(tool);

    // Calculate floating card position
    const rect = toolbarRef.current?.getBoundingClientRect();
    if (rect) {
      setSettingsPosition({
        x: rect.right + 8, 
        y: rect.top + (event.currentTarget as HTMLElement).offsetTop,
      });
    }
    setShowSettings(true);
  };


  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // TODO: Handle image file upload
      console.log("Image selected:", file.name);
      setActiveTool("image");
    }
  };

  return (
    <>
      <div ref={toolbarRef} className="flex flex-col w-16 min-h-full bg-base-200 border-r border-base-300 p-2 gap-2">
        {/* Tool Selection */}
        <div className="flex flex-col gap-1">
          <button
            className={`btn btn-square btn-md ${
              activeTool === "brush" ? "btn-primary" : "btn-ghost"
            }`}
            onClick={(e) => handleToolClick("brush", e)}
          >
            Brush
          </button>
          <button
            className={`btn btn-square btn-md ${
              activeTool === "eraser" ? "btn-primary" : "btn-ghost"
            }`}
            onClick={(e) => handleToolClick("eraser", e)}
          >
            Eraser
          </button>
          <button
            className={`btn btn-square btn-md ${
              activeTool === "select" ? "btn-primary" : "btn-ghost"
            }`}
            onClick={(e) => handleToolClick("select", e)}
          >
            Select
          </button>
          <button
            className={`btn btn-square btn-md ${
              activeTool === "image" ? "btn-primary" : "btn-ghost"
            }`}
            onClick={(e) => handleToolClick("image", e)}
          >
            Image
          </button>
        </div>

        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          ref={fileInputRef}
        />
      </div>

      <ToolSettings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        position={settingsPosition}
      >
        {activeTool === "brush" && <BrushSettings />}
        {/* Other tool settings */}
      </ToolSettings>
    </>
  );
};

export default MapToolbar;
