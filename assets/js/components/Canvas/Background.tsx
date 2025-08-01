import Konva from "konva";
import { Layer, Rect, Text } from "react-konva";
import React from "react";

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
      <Text text="The ocean" fontSize={16} fill="yellow" />
    </Layer>
  );
};

export default Background;
