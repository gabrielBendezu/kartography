import Konva from "konva";
import React from "react";
import { Stage, Layer, Line } from "react-konva";

type BrushLine = {
  tool: string;
  points: number[];
};

const KonvaMapCanvas = () => {
  const [tool, setTool] = React.useState("brush");
  const [lines, setLines] = React.useState<BrushLine[]>([]);
  const isDrawing = React.useRef(false);

  const handleMouseDown = (
    payload: Konva.KonvaEventObject<MouseEvent | TouchEvent>
  ) => {
    isDrawing.current = true;

    const position = getPointerPosition(payload);
    if (!position) return;

    setLines([...lines, { tool, points: [position.x, position.y] }]);
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
    <>
      <select
        value={tool}
        onChange={(e) => {
          setTool(e.target.value);
        }}
      >
        <option value="brush">Brush</option>
        <option value="eraser">Eraser</option>
        <option value="landmass">Landmass</option>
      </select>
      <Stage
        width={window.innerWidth}
        height={window.innerHeight - 25}
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
      >
        <Layer>
          {lines.map((line, i) => (
            <Line
              key={i}
              points={line.points}
              stroke="#df4b26"
              strokeWidth={5}
              tension={0.5}
              lineCap="round"
              lineJoin="round"
              globalCompositeOperation={
                line.tool === "eraser" ? "destination-out" : "source-over"
              }
            />
          ))}
        </Layer>
      </Stage>
    </>
  );
};

export default KonvaMapCanvas;
