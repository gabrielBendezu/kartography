import Konva from "konva";
import React from "react";
import { Stage, Layer, Line } from "react-konva";

import { Channel } from "phoenix";

import Background from "../Canvas/Background";
import Foreground from "../Canvas/Foreground";
import { useMapContext } from "../../contexts/MapContext";
import useKonvaChannelSync from "../../hooks/useKonvaChannelSync";

type BrushLine = {
  tool: string;
  points: number[];
  color: string;
  width: number;
  opacity: number;
};

interface KonvaMapCanvasProps {
  channel: Channel;
}

const KonvaMapCanvas = ({ channel }: KonvaMapCanvasProps) => {
  const { activeTool, brushSettings } = useMapContext();
  const [lines, setLines] = React.useState<BrushLine[]>([]);
  const isDrawing = React.useRef(false);
  const stageRef = React.useRef<Konva.Stage>(null);

  const handleReceiveBrushstroke = (brushstrokeData: {
    points: number[];
    color: string;
    width: number;
    opacity: number;
  }) => {
    // Add the received brushstroke to our lines
    const newLine: BrushLine = {
      tool: "brush", // Default to brush tool for received strokes
      points: brushstrokeData.points,
      color: brushstrokeData.color,
      width: brushstrokeData.width,
      opacity: brushstrokeData.opacity,
    };
    
    setLines(prevLines => [...prevLines, newLine]);
  };

  useKonvaChannelSync(channel, stageRef.current, handleReceiveBrushstroke);

  const handleMouseDown = (
    payload: Konva.KonvaEventObject<MouseEvent | TouchEvent>
  ) => {
    isDrawing.current = true;

    const position = getPointerPosition(payload);
    if (!position) return;

    setLines([
      ...lines,
      {
        tool: activeTool,
        points: [position.x, position.y],
        color: brushSettings.color,
        width: brushSettings.width,
        opacity: brushSettings.opacity,
      },
    ]);
  };

  const handleMouseMove = (
    payload: Konva.KonvaEventObject<MouseEvent | TouchEvent>
  ) => {
    if (!isDrawing.current) return;

    const position = getPointerPosition(payload);
    if (!position) return;

    // To draw line
    let lastLine = lines[lines.length - 1];
    // add point
    lastLine.points = lastLine.points.concat([position.x, position.y]);

    // replace last
    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat());
  };

  const getPointerPosition = (
    payload: Konva.KonvaEventObject<MouseEvent | TouchEvent>
  ): Konva.Vector2d | null => {
    const stage = payload.target.getStage();
    if (!stage) {
      console.warn("Stage not found", payload);
      return null;
    }
    const position = stage.getPointerPosition();
    if (!position) {
      console.warn("Position unavailable");
      return null;
    }

    return position;
  };

  const handleMouseUp = () => {
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

export default KonvaMapCanvas;
