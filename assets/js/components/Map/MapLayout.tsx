import MapToolbar, { ToolType } from "./MapToolbar";
import MapCanvas from "./MapCanvas";
import { useState } from "react";
import styles from "./MapLayout.module.css";

import { Channel } from "phoenix";

interface BrushSettings {
  width: number;
  color: string;
  opacity: number;
}

interface MapLayoutProps {
  channel: Channel;
}

const MapLayout = ({ channel }: MapLayoutProps) => {
  const [currentTool, setCurrentTool] = useState<ToolType>('brush');
  const [brushSettings, setBrushSettings] = useState<BrushSettings>({
    width: 5,
    color: '#000000',
    opacity: 1
  });

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
    console.log('Image selected:', file.name);
  };

  return (
    <div className={styles.mapLayout}>
      <div className={styles.toolbar}>
        <MapToolbar 
          onToolChange={handleToolChange}
          onBrushSettingsChange={handleBrushSettingsChange}
          onImageSelect={handleImageSelect}
        />
      </div>
      <div className={styles.canvasArea}>
        <MapCanvas channel={channel} />
      </div>
    </div>
  );
};

export default MapLayout;
