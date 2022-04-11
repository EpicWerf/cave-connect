import React, { useCallback, useEffect, useState } from "react";
import {
	GoogleMap,
	useJsApiLoader,
	Marker as GoogleMarker,
	OverlayView,
} from "@react-google-maps/api";
import { smoothlyAnimatePanTo, viewAltitudeToGoogleZoomLevel } from "../services/MapHelper";
import { MAPS_API_KEY } from "../services/MapsApiKey";
import { Marker } from "../types/Cave.types";

const DEFAULT_MAP_TYPE = "terrain";
const DEFAULT_ZOOM_LEVEL = 8;
const JERUSALEM_POSITION = { lat: 31.7683, lng: 35.2137 };

const MAP_CONTAINER_STYLE = {
	width: "100%",
	height: "100%",
};

const MAP_OPTIONS = {
	scaleControl: true,
};

interface MapWindow extends Window {
	showLocation: (
		id: string,
		placename: string,
		latitude: number,
		longitude: number,
		viewLatitude: string,
		viewLongitude: string,
		viewTilt: string,
		viewRoll: string,
		viewAltitude: number,
		viewHeading: string
	) => void;
}

declare let window: MapWindow;

// This component wraps a third-party React container for the Google Maps API.
// We're using @react-google-maps/api to connect React with Google Maps.  It's
// fairly straightforward once you understand the documentation.  Instead of
// making Google markers, we have a semantic markers array with position, label,
// and viewAltitude.  We turn that semantic list into a Marker/OverlayView pairs
// that place the marker and label on the map.  (Marker and OverlayView come from
// @react-google-maps/api.)  The basic pattern here is to (1) Load the Google Maps
// JavaScript API by calling useJsApiLoader(), and (2) when it's loaded, to render
// a GoogleMap component, nesting any markers we need.
function AllCavesMap(props: { markers: Marker[] }) {
	// Our parent will tell us what markers to render.
	const { markers } = props;

	// We need to load the Google Maps JavaScript API first.  Note that this
	// will take some time and it might fail.
	const { isLoaded, loadError } = useJsApiLoader({
		id: "google-map-script",
		googleMapsApiKey: MAPS_API_KEY,
	});

	// Let's track the Google Maps object as a state variable.
	const [map, setMap] = useState<google.maps.Map | null>(null);

	// Because geocoded placed are hyperlinked to invoke a JavaScript function
	// named showLocation, we need to supply that function in the global context.
	// The function needs access to the map object, so it makes sense to create it
	// here.  We useCallback() so we're not creating a new function on each render
	// loop, and we assign that callback to window.showLocation as needed.
	const showLocation = useCallback(
		function (
			_id: string,
			_placename: string,
			latitude: number,
			longitude: number,
			_viewLatitude: string,
			_viewLongitude: string,
			_viewTilt: string,
			_viewRoll: string,
			viewAltitude: number,
			_viewHeading: string
		) {
			if (map) {
				smoothlyAnimatePanTo(
					map,
					{ lat: latitude, lng: longitude },
					viewAltitudeToGoogleZoomLevel(viewAltitude)
				);
			}
		},
		[map]
	);

	if (window.showLocation !== showLocation) {
		window.showLocation = showLocation;
	}

	// The reason for this effect is because whenever either markers or map
	// changes, we need to decide on the map center and zoom level.  This
	// effect depends on markers and map, so it re-runs when either of those
	// values change.
	useEffect(() => {
		const zoomMapToFitMarkers = function () {
			if (!map) {
				return;
			}

			let bounds = new google.maps.LatLngBounds();

			markers.forEach(function (marker) {
				bounds.extend({ lat: marker.position.lat, lng: marker.position.lng });
			});

			map.panTo(bounds.getCenter());
			map.fitBounds(bounds);
		};

		const zoomToMarker = function (marker: Marker) {
			if (!map) {
				return;
			}

			smoothlyAnimatePanTo(map, marker.position, viewAltitudeToGoogleZoomLevel(marker.viewAltitude));
		};

		if (markers) {
			// If there's just one marker, we zoom to view just that one.  If there
			// are many markers, we zoom the map to fit all of them in the viewport.
			if (markers.length === 1) {
				zoomToMarker(markers[0]);
			} else if (markers.length > 1) {
				zoomMapToFitMarkers();
			}
		}
	}, [markers, map]);

	// When the GoogleMap component finishes loading, this callback gets invoked.
	const onLoad = useCallback(function (mapInstance) {
		// I think it's a bug that I have to specify the mapTypeId here again.
		// I already did it below on GoogleMap.
		mapInstance.mapTypeId = DEFAULT_MAP_TYPE;
		setMap(mapInstance);
	}, []);

	// We should clean up after ourselves, and this ensures that we don't hang on to
	// a reference to the map object that corresponds with the GoogleMap that just
	// got unmounted.
	const onUnmount = useCallback(function () {
		setMap(null);
	}, []);

	// The JavaScript API loader could fail (e.g. network issues).
	if (loadError) {
		return <div>Unable to load Google Maps right now.</div>;
	}

	// Here's another idiom for rendering React components.  We write a couple of
	// render methods that return JSX expressions.
	const renderMarkerViews = () => {
		let views = [] as JSX.Element[];

		if (markers && markers.length > 0) {
			markers.forEach((marker, index) => {
				// We need a pin (Marker) and a label (OverlayView).
				views.push(
					<GoogleMarker
						key={`m${index}`}
						position={marker.position}
						animation={google.maps.Animation.DROP}
						draggable={false}
						clickable={false}
					/>
				);
				views.push(
					<OverlayView
						key={`l${index}`}
						position={marker.position}
						mapPaneName={OverlayView.MARKER_LAYER}
					>
						<div className="maplabel">{marker.label}</div>
					</OverlayView>
				);
			});
		}

		return views;
	};

	const renderMap = () => {
		return (
			<div>
				<GoogleMap
					// mapContainerStyle={MAP_CONTAINER_STYLE}
					// center={JERUSALEM_POSITION}
					// zoom={DEFAULT_ZOOM_LEVEL}
					// mapTypeId={DEFAULT_MAP_TYPE}
					// options={MAP_OPTIONS}
					// onLoad={onLoad}
					// onUnmount={onUnmount}
				>
					{/* {renderMarkerViews()} */}
				</GoogleMap>
			</div>
		);
	};

	// Again, we're using semantic HTML.  The first render will happen when the
	// API is not yet loaded, and some subsequent render will invoke the renderMap()
	// method after the JavaScript API is loaded and ready to use.
	return <aside id="map">{isLoaded ? renderMap() : <div>Loading...</div>}</aside>;
}

// Memo.  Hmm.  Why memo?  Well, for one it's what the @react-google-maps/api authors
// said to do.  But why?  React.memo is a high-level React component.  If your
// component renders the same result given the same props, you can wrap it in React.memo()
// and this will "memoize" the result.  In other words, it will cache the result and if
// there's no change in props, it skips the re-render.  This sounds like a great idea!
// We should probably look through the rest of the app and decide where else we could
// optimize our app in this manner.  But remember, premature optimization is the root of
// almost all evil (or at least most of it) in programming.  Let's be sure our app is
// fully working first, then come back and optimize later.
export default React.memo(AllCavesMap);
