import React from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { MAPS_API_KEY } from "../services/MapsApiKey";

const containerStyle = {
	width: "100%",
	height: "400px",
};

interface MapProps {
	lat: number;
	lng: number;
	name: string | undefined;
}

function MapComponent(props: MapProps) {
	const { lat, lng, name } = props;
	const caveLocation = {
		lat: lat,
		lng: lng,
	};

	return (
		<LoadScript googleMapsApiKey={MAPS_API_KEY}>
			<GoogleMap mapContainerStyle={containerStyle} center={caveLocation} zoom={10}>
				{caveLocation ? <Marker position={caveLocation} label={name} /> : null}
			</GoogleMap>
		</LoadScript>
	);
}

export default React.memo(MapComponent);
