import { Channel } from "phoenix";
import Konva from "konva";
import React, { useEffect } from "react";
import { ToolActionPayload } from "../components/Map/types";

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
  onReceiveAction?: (action: ToolActionPayload) => void
) => {
  useEffect(() => {
    const handleMapUpdate = (payload: any) => {
      // if (payload.clientId === clientId.current) {
      //   return; // Ignore own messages
      // } Need to do this we don't re-render everything

      const stage = stageRef.current;
      if (!stage || !onReceiveAction) return; // Hmm if initial brushstrokes aren't being heard by other clients then this might be the problem

      switch (payload.type) {
        case "terrainstroke":
          console.log("Received Terrainstroke", payload.data);

          break;
        case "brushstroke":
          console.log("Received brushstroke", payload.data);
          const toolAction: ToolActionPayload = {
            type: "tool_action",
            tool: "brush",
            data: payload.data,
          };
          onReceiveAction(toolAction);

          break;
        case "object_drop":
          console.log("Received image drop", payload.data);

          break;
        case "layer_creation":
          console.log("Received layer creation", payload.data);

          break;
        default:
          console.log("Unknown map update type:", payload.type);
      }
    };

    channel.on("map_update", handleMapUpdate);

    return () => {
      channel.off("map_update");
    };
  }, [channel, onReceiveAction, stageRef]);
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
