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
    // Send action (including brushstroke)
    if (!stage) {
      console.log("**NO STAGE**");
      return;
    }
    console.log("**WE HAVE A STAGE**");

    stage.on("mouseup", (event: Konva.KonvaEventObject<Event>) => {
      console.log("saw mouseup on stage");
      if (event.target.getClassName() === "Line") {
        console.log("saw line action on stage");
        const line = event.target as Konva.Line;
        channel.push("map_action", {
          type: "brushstroke",
          // clientID: clientId.current, Need to get this so we don't re-render everything
          data: {
            points: line.points(),
            color: line.stroke(),
            width: line.strokeWidth(),
            opacity: line.opacity(),
          },
        });
      }
    });

    // Listen for map updates from other users
    channel.on("map_update", (payload) => {
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
    });
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
