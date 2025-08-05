import { Channel } from "phoenix";
import Konva from "konva";
import React, { useEffect } from "react";

interface BrushstrokePayload {
  type: "brushstroke";
  data: {
    points: number[];
    color: string;
    width: number;
    opacity: number;
  };
}

const ChannelSync = (
  channel: Channel,
  stageRef: React.RefObject<Konva.Stage | null>,
  onReceiveBrushstroke?: (brushstroke: BrushstrokePayload["data"]) => void
) => {
  useEffect(() => {
    const handleMapUpdate = (payload: any) => {
      // if (payload.clientId === clientId.current) {
      //   return; // Ignore own messages
      // } Need to do this we don't re-render everything

      const stage = stageRef.current;

      switch (payload.type) {
        case "brushstroke":
          console.log("received brushstroke", payload.data);
          // Only process brushstrokes if we have a stage to render to
          if (stage && onReceiveBrushstroke) {
            onReceiveBrushstroke(payload.data);
          } else if (!stage) {
            console.log("Stage not ready, queuing brushstroke");
          }
          break;
        case "image_drop":
          break;
        case "layer_creation":
          break;
        default:
          console.log("Unknown map update type:", payload.type);
      }
    };

    channel.on("map_update", handleMapUpdate);

    return () => {
      channel.off("map_update");
    };
  }, [channel, onReceiveBrushstroke, stageRef]);
};

export default ChannelSync;

/* 
  Mouse Events:
  - click, dblclick, contextmenu
  - mousedown, mouseup, mousemove
  - mouseover, mouseout, mouseenter, mouseleave
  - wheel

  Touch Events:
  - touchstart, touchmove, touchend
  - tap, dbltap

  Pointer Events:
  - pointerdown, pointerup, pointermove
  - pointerover, pointerout, pointerenter, pointerleave
  - pointerclick, pointerdblclick, pointercancel

  Drag Events:
  - dragstart, dragmove, dragend

  Transform Events:
  - transformstart, transform, transformend
*/
