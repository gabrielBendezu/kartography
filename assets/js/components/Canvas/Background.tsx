import { Layer, Rect } from "react-konva";
import { rgb } from "d3-color";

const Background = () => {
  const marineBlue = rgb(25, 82, 120).toString();
  
  return (
    <Layer>
      <Rect
        x={0}
        y={0}
        width={window.innerWidth}
        height={window.innerHeight}
        fill={marineBlue}
      />
    </Layer>
  );
};

export default Background;
