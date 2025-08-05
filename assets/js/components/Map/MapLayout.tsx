import MapToolbar from "./MapToolbar";
import { MapContextProvider } from "../../contexts/MapContext";
import MapCanvas from "./MapCanvas";

import { Channel } from "phoenix";

interface MapLayoutProps {
  channel: Channel;
}

const MapLayout = ({ channel }: MapLayoutProps) => {
  return (
    <MapContextProvider>
      <div className="flex h-full w-full">
        <div className="flex-shrink-0">
          <MapToolbar />
        </div>
        <div className="flex-1 relative overflow-hidden m-12">
          <MapCanvas channel={channel} />
        </div>
      </div>
    </MapContextProvider>
  );
};

export default MapLayout;
