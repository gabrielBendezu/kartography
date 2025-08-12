import { Layer } from "react-konva";

const Terrain = ({ children }: { children?: React.ReactNode }) => {
  return (
    <Layer>
      {children}
    </Layer>
  );
};

export default Terrain;