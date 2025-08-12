import Konva from "konva";
import React from "react";
import { Stage, Line } from "react-konva";

import { Channel } from "phoenix";

import Background from "../Canvas/Background";
import Foreground from "../Canvas/Terrain";
import { useMapContext } from "../../contexts/MapContext";
import ChannelSync from "../../hooks/ChannelSync";
import { getToolHandlers } from "./tools/toolRegistry";
import { ToolType, BrushLine } from "./types";

interface MapCanvasProps {
  channel: Channel;
}

const MapCanvas = ({ channel }: MapCanvasProps) => {
  const { activeTool, getActiveToolSettings } = useMapContext();
  const [lines, setLines] = React.useState<BrushLine[]>([]);
  const isDrawing = React.useRef(false);
  const stageRef = React.useRef<Konva.Stage>(null);
  const processingQueue = React.useRef(false);
  const actionQueue = React.useRef<any[]>([]);

  const processActionQueue = React.useCallback(async () => {
    if (processingQueue.current || actionQueue.current.length === 0) return;

    processingQueue.current = true;

    while (actionQueue.current.length > 0) {
      const payload = actionQueue.current.shift();

      const toolType = payload.type as ToolType;
      const toolConfig = getToolHandlers[toolType];
      const toolHandlers = toolConfig?.handlers;

      if (toolHandlers) {
        console.log("Processing queued action:", payload.data);
        await new Promise((resolve) => {
          toolHandlers.handleReceiveAction(payload.data, lines, setLines);
          setTimeout(resolve, 0); // Allow React to process state update
        });
      }
    }

    processingQueue.current = false;
  }, [lines]);

  const handleReceiveAction = React.useCallback(
    (payload: any) => {
      console.log("Queueing action:", payload);
      actionQueue.current.push(payload);
      processActionQueue();
    },
    [processActionQueue]
  );

  ChannelSync(channel, stageRef, handleReceiveAction);

  const handleMouseDown = (
    event: Konva.KonvaEventObject<MouseEvent | TouchEvent>
  ) => {
    isDrawing.current = true;

    const toolConfig = getToolHandlers[activeTool];
    const toolHandlers = toolConfig?.handlers;

    if (toolHandlers) {
      const currentSettings = getActiveToolSettings();
      toolHandlers.handleMouseDown(event, currentSettings, lines, setLines);
    }
  };

  const handleMouseMove = (
    event: Konva.KonvaEventObject<MouseEvent | TouchEvent>
  ) => {
    if (!isDrawing.current) return;

    const toolConfig = getToolHandlers[activeTool];
    const toolHandlers = toolConfig?.handlers;

    if (toolHandlers) {
      toolHandlers.handleMouseMove(event, lines, setLines);
    }
  };

  const handleMouseUp = () => {
    if (isDrawing.current) {
      const toolConfig = getToolHandlers[activeTool];
      const toolHandlers = toolConfig?.handlers;

      if (toolHandlers) {
        toolHandlers.handleMouseUp(channel, lines);
      }
    }
    isDrawing.current = false;
  };

  return (
    <Stage
      ref={stageRef}
      className="w-full h-full border border-base-300 cursor-crosshair focus:outline-2 focus:outline-info focus:outline-offset-2"
      width={window.innerWidth}
      height={window.innerHeight - 25}
      onMouseDown={handleMouseDown}
      onMousemove={handleMouseMove}
      onMouseup={handleMouseUp}
      onTouchStart={handleMouseDown}
      onTouchMove={handleMouseMove}
      onTouchEnd={handleMouseUp}
    >
      <Background />
      <Foreground>
        {lines.map((line, i) => (
          <Line
            key={i}
            points={line.points}
            stroke={line.color}
            strokeWidth={line.width}
            opacity={line.opacity}
            tension={0.5}
            lineCap="round"
            lineJoin="round"
            globalCompositeOperation={
              line.tool === "eraser" ? "destination-out" : "source-over"
            }
          />
        ))}
      </Foreground>
    </Stage>
  );
};

export default MapCanvas;
