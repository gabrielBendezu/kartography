import MapToolbar, { ToolType } from "./MapToolbar";
import MapCanvas from "./MapCanvas";
import { useState } from "react";

import { Channel } from "phoenix";

import { BrushSettings } from "./types";

interface MapLayoutProps {
  channel: Channel;
}

const MapLayout = ({ channel }: MapLayoutProps) => {
  const [currentTool, setCurrentTool] = useState<ToolType>("brush");
  const [brushSettings, setBrushSettings] = useState<BrushSettings>({
    width: 5,
    color: "#000000",
    opacity: 1,
  }); // this should be a hook called maybe useMapState

  const handleToolChange = (tool: ToolType) => {
    setCurrentTool(tool);
    // TODO: Update canvas tool mode
  };

  const handleBrushSettingsChange = (settings: BrushSettings) => {
    setBrushSettings(settings);
    // TODO: Update canvas brush settings
  };

  const handleImageSelect = (file: File) => {
    // TODO: Handle image placement on canvas
    console.log("Image selected:", file.name);
  };

  return (
    <div className="flex h-full w-full">
      <div className="flex-shrink-0">
        <MapToolbar
          onToolChange={handleToolChange}
          onBrushSettingsChange={handleBrushSettingsChange}
          onImageSelect={handleImageSelect}
        />
      </div>
      <div className="flex-1 relative overflow-hidden m-12 bg-error">
        <MapCanvas channel={channel} brushSettings={brushSettings} />
      </div>
    </div>
  );
};

export default MapLayout;
