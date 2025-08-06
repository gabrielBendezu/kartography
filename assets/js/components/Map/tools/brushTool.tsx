import React from "react";
import Konva from "konva";
import { Channel } from "phoenix";
import { BrushConfig, BrushLine } from "../types";

const brushTool = {
  handleMouseDown: (
    event: Konva.KonvaEventObject<MouseEvent | TouchEvent>,
    brushSettings: BrushConfig,
    lines: BrushLine[],
    setLines: React.Dispatch<React.SetStateAction<BrushLine[]>>
  ) => {
    const position = getPointerPosition(event);
    if (!position) return;

    const newLine: BrushLine = {
      tool: "brush",
      points: [position.x, position.y],
      color: brushSettings.color,
      width: brushSettings.width,
      opacity: brushSettings.opacity,
    };

    setLines([...lines, newLine]);
  },

  handleMouseMove: (
    event: Konva.KonvaEventObject<MouseEvent | TouchEvent>,
    lines: BrushLine[],
    setLines: React.Dispatch<React.SetStateAction<BrushLine[]>>
  ) => {
    const position = getPointerPosition(event);
    if (!position) return;

    if (lines.length === 0) return;

    const lastLine = lines[lines.length - 1];
    const updatedLine = {
      ...lastLine,
      points: lastLine.points.concat([position.x, position.y]),
    };

    const newLines = [...lines];
    newLines[newLines.length - 1] = updatedLine;
    setLines(newLines);
  },

  handleMouseUp: (channel: Channel, lines: BrushLine[]) => {
    if (lines.length === 0) return;

    const lastLine = lines[lines.length - 1];
    const brushData = {
      points: lastLine.points,
      color: lastLine.color,
      width: lastLine.width,
      opacity: lastLine.opacity,
    };

    console.log("SENDING brushstroke:", {
      pointCount: brushData.points.length / 2,
      color: brushData.color,
      width: brushData.width,
      timestamp: Date.now(),
    });

    channel.push("map_action", {
      type: "brush",
      data: brushData,
    });
  },

  handleReceiveAction: (
    data: any,
    _lines: BrushLine[],
    setLines: React.Dispatch<React.SetStateAction<BrushLine[]>>
  ) => {
    console.log("RECEIVED brushstroke:", {
      pointCount: data.points ? data.points.length / 2 : 0,
      color: data.color,
      width: data.width,
      timestamp: Date.now(),
    });

    if (!data || !data.points) {
      console.warn("Invalid brush data received:", data);
      return;
    }

    const newLine: BrushLine = {
      tool: "brush",
      points: data.points,
      color: data.color,
      width: data.width,
      opacity: data.opacity,
    };

    setLines((prevLines) => {
      console.log(`Adding stroke to ${prevLines.length} existing lines`);
      return [...prevLines, newLine];
    });
  },
};

const getPointerPosition = (
  event: Konva.KonvaEventObject<MouseEvent | TouchEvent>
): Konva.Vector2d | null => {
  const stage = event.target.getStage();
  if (!stage) {
    console.warn("Stage not found", event);
    return null;
  }
  const position = stage.getPointerPosition();
  if (!position) {
    console.warn("Position unavailable");
    return null;
  }
  return position;
};

export default brushTool;
