import React from "react";
import Konva from "konva";
import { Channel } from "phoenix";
import { TerrainConfig, BrushLine } from "../types";

const terrainTool = {
  handleMouseDown: (
    event: Konva.KonvaEventObject<MouseEvent | TouchEvent>,
    terrainSettings: TerrainConfig,
    lines: BrushLine[],
    setLines: React.Dispatch<React.SetStateAction<BrushLine[]>>
  ) => {
    const position = getPointerPosition(event);
    if (!position) return;

    const newLine: BrushLine = {
      tool: "terrain",
      points: [position.x, position.y],
      color: terrainSettings.color,
      width: terrainSettings.width,
      opacity: terrainSettings.opacity,
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
    if (lastLine.tool !== "terrain") return;

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
    if (lastLine.tool !== "terrain") return;

    const terrainData = {
      points: lastLine.points,
      color: lastLine.color,
      width: lastLine.width,
      opacity: lastLine.opacity,
    };

    console.log("SENDING terrain stroke:", {
      pointCount: terrainData.points.length / 2,
      color: terrainData.color,
      width: terrainData.width,
      timestamp: Date.now(),
      channel: channel,
    });

    channel.push("map_action", {
      type: "terrain",
      data: terrainData,
    });
  },

  handleReceiveAction: (
    data: any,
    _lines: BrushLine[],
    setLines: React.Dispatch<React.SetStateAction<BrushLine[]>>
  ) => {
    console.log("RECEIVED terrain stroke:", {
      pointCount: data.points ? data.points.length / 2 : 0,
      color: data.color,
      width: data.width,
      timestamp: Date.now(),
    });

    if (!data || !data.points) {
      console.warn("Invalid terrain data received:", data);
      return;
    }

    const newLine: BrushLine = {
      tool: "terrain",
      points: data.points,
      color: data.color,
      width: data.width,
      opacity: data.opacity,
    };

    setLines((prevLines) => {
      console.log(
        `Adding terrain stroke to ${prevLines.length} existing lines`
      );
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

export default terrainTool;
