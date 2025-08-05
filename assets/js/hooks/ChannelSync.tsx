import { Channel } from "phoenix";
import Konva from "konva";
import React, { useEffect } from "react";
import { ToolType } from "../components/Map/types";

const ChannelSync = (
  channel: Channel,
  stageRef: React.RefObject<Konva.Stage | null>,
  onReceiveAction?: (payload: any) => void
) => {
  useEffect(() => {
    const handleMapUpdate = (payload: any) => {
      // if (payload.clientId === clientId.current) {
      //   return; // Ignore own messages
      // } Need to do this we don't re-render everything

      const stage = stageRef.current;
      if (!stage || !onReceiveAction) return; // Hmm if initial brushstrokes aren't being heard by other clients then this might be the problem

      const toolType = payload.type as ToolType;
      const validToolTypes = ["select", "terrain", "brush", "text", "path", "object", "map_mode"] as const;
      if (validToolTypes.indexOf(toolType) !== -1) {
        console.log(`Received ${toolType}`, payload.data);
        onReceiveAction(payload);
      } else {
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
