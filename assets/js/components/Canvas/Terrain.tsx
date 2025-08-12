import { Layer } from "react-konva";

const Foreground = ({ children }: { children?: React.ReactNode }) => {
  return (
    <Layer>
      {children}
    </Layer>
  );
};

export default Foreground;