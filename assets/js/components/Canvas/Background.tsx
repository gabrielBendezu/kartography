import { Layer, Rect, Text } from "react-konva";

const Background = () => {
  return (
    <Layer>
      <Rect
        x={0}
        y={0}
        width={window.innerWidth}
        height={window.innerHeight}
        fill="blue"
      />
    </Layer>
  );
};

export default Background;
