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
        fillLinearGradientStartPoint={{ x: 0, y: 0 }}
        fillLinearGradientEndPoint={{ x: 0, y: window.innerHeight }}
        fillLinearGradientColorStops={[0, '#1a5280', 0.5, '#2d6fa8', 1, '#4a8bc2']}
      />
    </Layer>
  );
};

export default Background;
