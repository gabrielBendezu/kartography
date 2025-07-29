import MapToolbar from "./MapToolbar";
import MapCanvas from "./MapCanvas";

import { Channel } from "phoenix"

interface MapLayoutProps {
    channel: Channel;
}

const MapLayout = ({ channel }: MapLayoutProps) => {
    return (
        <div className="map-layout">
            <MapToolbar children={"child: hello world"} />
            <MapCanvas channel={channel} />
        </div>
    );
};

export default MapLayout;