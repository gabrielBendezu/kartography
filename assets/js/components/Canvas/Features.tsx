import { Layer } from "react-konva";

const Features = ({ children }: { children?: React.ReactNode }) => {
  return (
    <Layer>
      {children}
    </Layer>
  );
};

export default Features; 