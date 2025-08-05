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

      switch (payload.type) {
        case "tool_action":
          console.log("received tool action", payload);
          if (stage && onReceiveAction) {
            onReceiveAction(payload);
          } else if (!stage) {
            console.log("Stage not ready, queuing tool action");
          }
          break;
        case "brushstroke":
          console.log("received brushstroke (legacy)", payload.data);
          // Legacy brushstroke support - convert to tool_action
          if (stage && onReceiveAction) {
            const toolAction: ToolActionPayload = {
              type: "tool_action",
              tool: "brush",
              data: payload.data
            };
            onReceiveAction(toolAction);
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
