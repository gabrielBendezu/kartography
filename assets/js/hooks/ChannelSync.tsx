import { Channel } from "phoenix";
import Konva from "konva";

import { useEffect } from "react";

interface BrushstrokePayload {
  type: "brushstroke";
  data: {
    points: number[];
    color: string;
    width: number;
    opacity: number;
  };
}

const useKonvaChannelSync = (
  channel: Channel,
  stage: Konva.Stage | null,
  onReceiveBrushstroke?: (brushstroke: BrushstrokePayload["data"]) => void
) => {
  useEffect(() => {
    if (!stage) {
      console.log("**NO STAGE**");
      return;
    }
    console.log("**WE HAVE A STAGE**");

    const handleMapUpdate = (payload: any) => {
      // if (payload.clientId === clientId.current) {
      //   return; // Ignore own messages
      // } Need to do this we don't re-render everything

      switch (payload.type) {
        case "brushstroke":
          console.log("received brushstroke", payload.data);
          if (onReceiveBrushstroke) {
            onReceiveBrushstroke(payload.data);
          }
          break;
        case "image_drop":
          break;
        case "layer_toggle":
          break;
        default:
          console.log("Unknown map update type:", payload.type);
      }
    };

    channel.on("map_update", handleMapUpdate);

    return () => {
      channel.off("map_update");
    };
  }, [stage, channel]);
};

export default useKonvaChannelSync;

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
