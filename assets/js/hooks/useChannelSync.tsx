import { useEffect } from "react";
import * as fabric from "fabric";
import { Channel } from "phoenix";

interface BrushStrokePayload {
  type: "brush_stroke";
  data: {
    pathString?: string;
    path?: any[]; // Funky?
    stroke?: string;
    strokeWidth?: number;
    fill?: string;
  };
}

const useChannelSync = (channel: Channel, canvas: fabric.Canvas | null) => {
  useEffect(() => {
    if (!canvas) return;
    // Receive brush strokes
    channel.on("canvas_update", (payload: BrushStrokePayload) => {
      switch (payload.type) {
        case "brush_stroke":
          // Regular path handling - use SVG string if available, fallback to path array
          if (payload.data.pathString) {
            // Parse the complete SVG string to avoid truncation
            fabric.loadSVGFromString(payload.data.pathString).then((result) => {
              const svgPath = result.objects[0];
              if (svgPath) {
                canvas.add(svgPath);
                canvas.renderAll();
              }
            });
          } else {
            // Fallback to path array (may be truncated)
            const path = new fabric.Path(payload.data.path, {
              stroke: payload.data.stroke,
              strokeWidth: payload.data.strokeWidth,
              fill: payload.data.fill,
            });
            canvas.add(path);
            canvas.renderAll();
          }
          break;
      }
    });

    // Send brush strokes
    // TODO: Maybe make the mapcanvas have it's own shared state, including brush settings
    canvas.on("path:created", (e) => {
      // Use the SVG path string instead of array to avoid truncation
      const pathString = e.path.toSVG();

      const pathData = {
        pathString: pathString,
        //path: e.path.path,
        stroke: e.path.stroke,
        strokeWidth: e.path.strokeWidth,
        fill: e.path.fill,
      };

      channel.push("canvas_draw", {
        type: "brush_stroke",
        data: pathData,
      } as BrushStrokePayload);
    });

    // Clean up when component unmounts
    return () => {
      channel.off("canvas_update");
    };
  }, [canvas, channel]);
};

export default useChannelSync;
