import React, { useState, useRef } from "react";
import ToolSettings from "./ToolSettings";
import { BrushSettings, TerrainSettings } from "./ToolbarSettings";
import { useMapContext } from "../../contexts/MapContext";

import { ToolType } from "./types";

const MapToolbar = () => {
  const { activeTool, setActiveTool } = useMapContext();

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

  return (
    <>
      <div
        ref={toolbarRef}
        className="flex flex-col w-16 min-h-full bg-base-200 border-r border-base-300 p-2 gap-2"
      >
        {/* Tool Selection */}
        <div className="flex flex-col gap-1">
          <button
            className={`btn btn-square btn-md tooltip tooltip-right ${
              activeTool === "select" ? "btn-primary" : "btn-ghost"
            }`}
            onClick={(e) => handleToolClick("select", e)}
            data-tip="Select"
          >
            <span className="hero-hand-raised bg-current size-6"></span>
          </button>

          <button
            className={`btn btn-square btn-md tooltip tooltip-right ${
              activeTool === "terrain" ? "btn-primary" : "btn-ghost"
            }`}
            onClick={(e) => handleToolClick("terrain", e)}
            data-tip="Terrain"
          >
            <span className="hero-globe-asia-australia bg-current size-6"></span>
          </button>

          <button
            className={`btn btn-square btn-md tooltip tooltip-right ${
              activeTool === "brush" ? "btn-primary" : "btn-ghost"
            }`}
            onClick={(e) => handleToolClick("brush", e)}
            data-tip="Brush"
          >
            <span className="hero-paint-brush bg-current size-6"></span>
          </button>

          <button
            className={`btn btn-square btn-md tooltip tooltip-right ${
              activeTool === "object" ? "btn-primary" : "btn-ghost"
            }`}
            onClick={(e) => handleToolClick("object", e)}
            data-tip="Objects"
          >
            <span className="hero-building-library bg-current size-6"></span>
          </button>

          <button
            className={`btn btn-square btn-md tooltip tooltip-right ${
              activeTool === "text" ? "btn-primary" : "btn-ghost"
            }`}
            onClick={(e) => handleToolClick("text", e)}
            data-tip="Text"
          >
            <span className="hero-document-text bg-current size-6"></span>
          </button>

          <button
            className={`btn btn-square btn-md tooltip tooltip-right ${
              activeTool === "path" ? "btn-primary" : "btn-ghost"
            }`}
            onClick={(e) => handleToolClick("path", e)}
            data-tip="Path"
          >
            <span className="hero-minus bg-current size-6"></span>
          </button>

          <button
            className={`btn btn-square btn-md tooltip tooltip-right ${
              activeTool === "map_mode" ? "btn-primary" : "btn-ghost"
            }`}
            onClick={(e) => handleToolClick("map_mode", e)}
            data-tip="Map Modes"
          >
            <span className="hero-rectangle-stack bg-current size-6"></span>
          </button>
        </div>
      </div>

      <ToolSettings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        position={settingsPosition}
      >
        {activeTool === "select" && <TerrainSettings />}
        {activeTool === "terrain" && <TerrainSettings />}
        {activeTool === "brush" && <BrushSettings />}
        {activeTool === "object" && <TerrainSettings />}
        {activeTool === "text" && <TerrainSettings />}
        {activeTool === "path" && <TerrainSettings />}
        {activeTool === "map_mode" && <TerrainSettings />}
      </ToolSettings>
    </>
  );
};

export default MapToolbar;
