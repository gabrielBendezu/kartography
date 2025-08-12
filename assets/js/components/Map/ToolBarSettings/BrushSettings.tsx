import { useMapContext } from "../../../contexts/MapContext";
import { BrushConfig } from "../types";

const BrushSettings = () => {
  const { getActiveToolSettings, setToolSettings, activeTool } =
    useMapContext();
  const brushConfig = getActiveToolSettings() as BrushConfig;

  const handleBrushChange = (
    key: keyof BrushConfig,
    value: number | string
  ) => {
    const newSettings = { ...brushConfig, [key]: value };

    console.log("handleBrushChange called");

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
          value={brushConfig.width}
          className="range range-primary range-xs"
          onChange={(e) => handleBrushChange("width", parseInt(e.target.value))}
        />
        <span className="text-xs text-base-content/70 text-center mt-1">
          {brushConfig.width}px
        </span>
      </div>
      <div className="form-control">
        <label className="label py-1">
          <span className="label-text text-xs font-medium">Color:</span>
        </label>
        <input
          type="color"
          value={brushConfig.color}
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
          value={brushConfig.opacity}
          className="range range-primary range-xs"
          onChange={(e) =>
            handleBrushChange("opacity", parseFloat(e.target.value))
          }
        />
        <span className="text-xs text-base-content/70 text-center mt-1">
          {Math.round(brushConfig.opacity * 100)}%
        </span>
      </div>
    </div>
  );
};

export default BrushSettings;
