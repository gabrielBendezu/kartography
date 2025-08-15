import { useMapContext } from "../../../contexts/MapContext";
import { TerrainConfig } from "../../../types";

const TerrainSettings = () => {
  const { getActiveToolSettings, setToolSettings, activeTool } =
    useMapContext();
  const terrainConfig = getActiveToolSettings() as TerrainConfig;

  const handleTerrainChange = (
    key: keyof TerrainConfig,
    value: number | string | boolean
  ) => {
    const newSettings = { ...terrainConfig, [key]: value };

    setToolSettings(activeTool, newSettings);
  };

  const handleCoastlineToggle = (enabled: boolean) => {
    const newSettings = {
      ...terrainConfig,
      coastlineEffect: {
        enabled,
        waveAmplitude: terrainConfig.coastlineEffect?.waveAmplitude || 5,
        waveFrequency: terrainConfig.coastlineEffect?.waveFrequency || 0.1,
        fadeDistance: terrainConfig.coastlineEffect?.fadeDistance || 10,
      },
    };

    setToolSettings(activeTool, newSettings);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="form-control">
        <label className="label py-1">
          <span className="label-text text-xs font-medium">Size:</span>
        </label>
        <input
          type="range"
          min="1"
          max="50"
          value={terrainConfig.width}
          className="range range-primary range-xs"
          onChange={(e) =>
            handleTerrainChange("width", parseInt(e.target.value))
          }
        />
        <span className="text-xs text-base-content/70 text-center mt-1">
          {terrainConfig.width}px
        </span>
      </div>
      <div className="form-control">
        <label className="label py-1">
          <span className="label-text text-xs font-medium">Color:</span>
        </label>
        <input
          type="color"
          value={terrainConfig.color}
          className="w-8 h-8 rounded border border-base-300 cursor-pointer mx-auto"
          onChange={(e) => handleTerrainChange("color", e.target.value)}
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
          value={terrainConfig.opacity}
          className="range range-primary range-xs"
          onChange={(e) =>
            handleTerrainChange("opacity", parseFloat(e.target.value))
          }
        />
        <span className="text-xs text-base-content/70 text-center mt-1">
          {Math.round(terrainConfig.opacity * 100)}%
        </span>
      </div>
      <div className="form-control">
        <label className="label cursor-pointer py-1">
          <span className="label-text text-xs font-medium">Special Coastline:</span>
          <input
            type="checkbox"
            checked={terrainConfig.coastlineEffect?.enabled || false}
            className="checkbox checkbox-primary checkbox-sm"
            onChange={(e) => handleCoastlineToggle(e.target.checked)}
          />
        </label>
      </div>
    </div>
  );
};

export default TerrainSettings;
