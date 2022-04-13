import React from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { MAPS_API_KEY } from "../services/MapsApiKey";
import { Coordinate } from "../types/Cave.types";

interface MapProps {
	locations: Coordinate[];
	name: string | undefined;
	mapHeight: string;
	mapWidth: string;
	zoomLevel: number;
}

function MapComponent(props: MapProps) {
	const { locations, name, mapHeight, mapWidth, zoomLevel } = props;

	const containerStyle = {
		width: mapWidth,
		height: mapHeight,
	};

	const caveLocation = {
		lat: locations[0].lat,
		lng: locations[0].lng,
	};

	return (
		<LoadScript googleMapsApiKey={MAPS_API_KEY}>
			<GoogleMap mapContainerStyle={containerStyle} center={caveLocation} zoom={zoomLevel}>
				{locations.map((location, index) => (
					<Marker key={index} label={name} position={{ lat: location.lat, lng: location.lng }} />
				))}
			</GoogleMap>
		</LoadScript>
	);
}

export default React.memo(MapComponent);
