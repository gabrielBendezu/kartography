import Konva from "konva";
import React from "react";
import { Stage, Line } from "react-konva";

import { Channel } from "phoenix";

import Background from "../Canvas/Background";
import Foreground from "../Canvas/Foreground";
import { useMapContext } from "../../contexts/MapContext";
import ChannelSync from "../../hooks/ChannelSync";
import { getToolHandlers } from "./tools/toolRegistry";
import { ToolType } from "./types";

type BrushLine = {
  tool: string;
  points: number[];
  color: string;
  width: number;
  opacity: number;
};

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

  const handleReceiveAction = React.useCallback(
    (payload: any) => {
      // TODO: fix this any to be something
      console.log("MapCanvas handleReceiveAction received:", payload);

      const toolType = payload.type as ToolType;
      const toolConfig = getToolHandlers[toolType];
      const toolHandlers = toolConfig?.handlers;

      if (toolHandlers) {
        console.log("Calling tool handler with data:", payload.data);
        toolHandlers.handleReceiveAction(payload.data, lines, setLines);
      } else {
        console.warn("No handlers found for tool:", toolType);
      }
    },
    [lines]
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
