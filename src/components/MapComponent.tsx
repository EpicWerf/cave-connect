import React from "react";
import { GoogleMap, InfoBox, LoadScript, Marker } from "@react-google-maps/api";
import { MAPS_API_KEY } from "../services/MapsApiKey";

const containerStyle = {
	width: "100%",
	height: "400px",
};

interface MapProps {
	lat: number;
	lng: number;
}

function MapComponent(props: MapProps) {
	const { lat, lng } = props;
	const caveLocation = {
		lat: lat,
		lng: lng,
	};
	return (
		<LoadScript googleMapsApiKey={MAPS_API_KEY}>
			<GoogleMap mapContainerStyle={containerStyle} center={caveLocation} zoom={10}>
				{/* Child components, such as markers, info windows, etc. */}
				<Marker position={caveLocation}  />
			</GoogleMap>
		</LoadScript>
	);
}

export default React.memo(MapComponent);
