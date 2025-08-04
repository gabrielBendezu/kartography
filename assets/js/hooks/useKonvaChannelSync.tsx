import { Channel } from "phoenix";
import Konva from "konva";

import { useEffect } from "react";

interface Payload {
  type: string;
  data: {
    path: string;
    strokeWidth: number;
  };
}

const useKonvaChannelSync = (channel: Channel, stage: Konva.Stage | null) => {
  useEffect(() => {
    // Receive action (including brushstrokes)
    // Send action (including brushstroke)
    if (!stage) {
      console.log("**NO STAGE**")
      return;
    };
    console.log("**WE HAVE A STAGE**")

    stage.on("mouseup", (event: Konva.KonvaEventObject<Event>) => {
      console.log("saw mouseup on stage")
      if (event.target.getClassName() === 'Line') {
        console.log("saw line action on stage")
        channel.push("map_action", {
          type: "brushstroke",
          data: {
            points: event.target.getAbsolutePosition,
            test1: "test1",
            // color: event.target.stroke(),
            // width: event.target.strokeWidth(),
            opacity: event.target.opacity(),
            test2: "test2"
          }
        });
      }
    });

    // Listen for map updates from other users
    channel.on("map_update", (payload) => {
      // Handle different types of updates
      switch (payload.type) {
        case "brushstroke":
          // Render brush stroke from other user
          console.log("received brushstroke");
          break;
        case "image_drop":
          // Handle image drop from other user
          break;
        case "layer_toggle":
          // Handle layer visibility changes
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
