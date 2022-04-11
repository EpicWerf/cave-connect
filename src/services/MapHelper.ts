/*----------------------------------------------------------------------
 *                      IMPORTS
 */
import { Marker, Position } from '../types/Cave.types';

/*----------------------------------------------------------------------
 *                      CONSTANTS
 */
const INDEX_ALTITUDE = 9;
const INDEX_FLAG = 11;
const INDEX_LATITUDE = 3;
const INDEX_LONGITUDE = 4;
const INDEX_PLACENAME = 2;
const LAT_LON_PARSER = /(.*),'(.*)',(.*),(.*),(.*),(.*),(.*),(.*),(.*),(.*),'(.*)'/;
const LINK_EXTRACTOR = /<a[^>]*onclick="showLocation\(([^,]*,'[^']*',[^,]*,[^,]*,[^,]*,[^,]*,[^,]*,[^,]*,[^,]*,[^,]*,'[^']*')\)/g;
const MAX_ZOOM_LEVEL = 22;
const MIN_ZOOM_LEVEL = 6;
const DEFAULT_ZOOM_LEVEL = MIN_ZOOM_LEVEL + (MAX_ZOOM_LEVEL - MIN_ZOOM_LEVEL) / 2;
const ZOOM_RATIO = 450;

/*----------------------------------------------------------------------
 *                      EXTERNAL CODE
 */
// See https://stackoverflow.com/a/52763732

// NEEDSWORK: This library is close, but isn't exactly right for this use case.
// Some of the zooming doesn't wrap up the way I expect.

/**
 * Handy functions to project lat/lng to pixel
 * Extracted from: https://developers.google.com/maps/documentation/javascript/examples/map-coordinates
 **/
function project(latLng: Position) {
    let TILE_SIZE = 256;

    let siny = Math.sin(latLng.lat * Math.PI / 180);

    // Truncating to 0.9999 effectively limits latitude to 89.189. This is
    // about a third of a tile past the edge of the world tile.
    siny = Math.min(Math.max(siny, -0.9999), 0.9999);

    return new window.google.maps.Point(
        TILE_SIZE * (0.5 + latLng.lng / 360),
        TILE_SIZE * (0.5 - Math.log((1 + siny) / (1 - siny)) / (4 * Math.PI)));
}

/**
 * Handy functions to project lat/lng to pixel
 * Extracted from: https://developers.google.com/maps/documentation/javascript/examples/map-coordinates
 **/
function getPixel(latLng: Position, zoom: number | undefined) {
    let scale = 1 << (zoom || 0);
    let worldCoordinate = project(latLng);

    return new window.google.maps.Point(
        Math.floor(worldCoordinate.x * scale),
        Math.floor(worldCoordinate.y * scale));
}

/**
 * Given a map, return the map dimension (width and height)
 * in pixels.
 **/
function getMapDimenInPixels(map: google.maps.Map) {
    let zoom = map.getZoom();
    let bounds = map.getBounds();

    if (bounds) {
        let southWestPixel = getPixel(position(bounds.getSouthWest()), zoom);
        let northEastPixel = getPixel(position(bounds.getNorthEast()), zoom);

        return {
            width: Math.abs(southWestPixel.x - northEastPixel.x),
            height: Math.abs(southWestPixel.y - northEastPixel.y)
        };
    }

    return { width: 0, height: 0 };
}

/**
 * Given a map and a destLatLng returns true if calling
 * map.panTo(destLatLng) will be smoothly animated or false
 * otherwise.
 *
 * optionalZoomLevel can be optionally be provided and if so
 * returns true if map.panTo(destLatLng) would be smoothly animated
 * at optionalZoomLevel.
 **/
function willAnimatePanTo(map: google.maps.Map, destLatLng: Position, optionalZoomLevel: number | undefined) {
    let dimen = getMapDimenInPixels(map);

    let mapCenter = map.getCenter();
    optionalZoomLevel = optionalZoomLevel || map.getZoom();

    let destPixel = getPixel(destLatLng, optionalZoomLevel);

    if (!mapCenter) {
        return false;
    }

    let mapPixel = getPixel(position(mapCenter), optionalZoomLevel);
    let diffX = Math.abs(destPixel.x - mapPixel.x);
    let diffY = Math.abs(destPixel.y - mapPixel.y);

    return diffX < dimen.width && diffY < dimen.height;
}

/**
 * Returns the optimal zoom value when animating 
 * the zoom out.
 *
 * The maximum change will be currentZoom - 3.
 * Changing the zoom with a difference greater than 
 * 3 levels will cause the map to "jump" and not
 * smoothly animate.
 *
 * Unfortunately the magical number "3" was empirically
 * determined as we could not find any official docs
 * about it.
 **/
function getOptimalZoomOut(map: google.maps.Map, latLng: Position, currentZoom: number | undefined) {
    currentZoom = currentZoom || DEFAULT_ZOOM_LEVEL;

    if (willAnimatePanTo(map, latLng, currentZoom - 1)) {
        return currentZoom - 1;
    } else if (willAnimatePanTo(map, latLng, currentZoom - 2)) {
        return currentZoom - 2;
    } else {
        return currentZoom - 3;
    }
}

/**
 * Given a map and a destLatLng, smoothly animates the map center to
 * destLatLng by zooming out until distance (in pixels) between map center
 * and destLatLng are less than map width and height, then panTo to destLatLng
 * and finally animate to restore the initial zoom.
 *
 * optionalAnimationEndCallback can be optionally be provided and if so
 * it will be called when the animation ends
 **/
function smoothlyAnimatePanToWorkaround(map: google.maps.Map, destLatLng: Position, optionalAnimationEndCallback: () => void | undefined) {
    let initialZoom = map.getZoom() || DEFAULT_ZOOM_LEVEL;
    let listener: google.maps.MapsEventListener;

    function zoomIn() {
        const zoom = map.getZoom() || DEFAULT_ZOOM_LEVEL;

        if (zoom < initialZoom) {
            map.setZoom(Math.min(zoom + 3, initialZoom));
        } else {
            window.google.maps.event.removeListener(listener);

            //here you should (re?)enable only the ui controls that make sense to your app 
            map.setOptions({ draggable: true, zoomControl: true, scrollwheel: true, disableDoubleClickZoom: false });

            if (optionalAnimationEndCallback) {
                optionalAnimationEndCallback();
            }
        }
    }

    function zoomOut() {
        if (willAnimatePanTo(map, destLatLng, 0)) {
            window.google.maps.event.removeListener(listener);
            listener = window.google.maps.event.addListener(map, 'idle', zoomIn);
            map.panTo(destLatLng);
        } else {
            map.setZoom(getOptimalZoomOut(map, destLatLng, map.getZoom()));
        }
    }

    //here you should disable all the ui controls that your app uses
    map.setOptions({ draggable: false, zoomControl: false, scrollwheel: false, disableDoubleClickZoom: true });
    map.setZoom(getOptimalZoomOut(map, destLatLng, initialZoom));
    listener = window.google.maps.event.addListener(map, 'idle', zoomOut);
}

function smoothlyAnimatePanTo(map: google.maps.Map, destLatLng: Position, zoomLevel: number | undefined) {
    if (typeof zoomLevel === "number" || typeof zoomLevel === "string") {
        map.setZoom(zoomLevel);
    }
    
    if (!map.getBounds() || willAnimatePanTo(map, destLatLng, undefined)) {
        map.panTo(destLatLng);
    } else {
        smoothlyAnimatePanToWorkaround(map, destLatLng, () => { });
    }
}

/*----------------------------------------------------------------------
 *                      INTERNAL CODE
 */
// This function is a trimmed-down version of what we had in the Project 1 & 2
// solution.  We don't need to deal with the map directly here because we're
// just maintaining a semantic array of markers (position/label/altitude).
// All the Google Maps API stuff is abstracted away for us.  This is kind of nice.
function extractMarkers(html: string) {
    let markers: Marker[] = [];

    const addMarker = function (placename: string, latitude: number, longitude: number, viewAltitude: number) {
        let index = markerIndex(latitude, longitude);

        if (index >= 0) {
            mergePlacename(placename, index);
        } else {
            markers.push({
                position: { lat: Number(latitude), lng: Number(longitude) },
                label: placename,
                viewAltitude,
            });
        }
    };

    const markerIndex = function (latitude: number, longitude: number) {
        let i = markers.length - 1;

        while (i >= 0) {
            let marker = markers[i];

            const latitudeDelta = Math.abs(marker.position.lat - latitude);
            const longitudeDelta = Math.abs(marker.position.lng - longitude);

            if (latitudeDelta < 0.00000001 && longitudeDelta < 0.00000001) {
                return i;
            }

            i -= 1;
        }

        return -1;
    };

    const mergePlacename = function (placename: string, index: number) {
        let marker = markers[index];
        let label = marker.label;

        if (label === undefined) {
            marker.label = placename;
        } else if (!label.includes(placename)) {
            label += ", " + placename;
            marker.label = label;
        }
    };

    // Here we vary from the previous solution.  Before we operated on the DOM tree,
    // but now we need to use a RegExp to find all the links.  This RegExp took a bit
    // of debugging before I got it right.  It was a little tricksy.
    let linkMatch;

    do {
        linkMatch = LINK_EXTRACTOR.exec(html);
        
        if (linkMatch) {
            let matches = LAT_LON_PARSER.exec(linkMatch[1]);

            if (matches) {
                let placename = matches[INDEX_PLACENAME];
                let latitude = parseFloat(matches[INDEX_LATITUDE]);
                let longitude = parseFloat(matches[INDEX_LONGITUDE]);
                let flag = matches[INDEX_FLAG];
                let viewAltitude = Number(matches[INDEX_ALTITUDE]);

                if (flag !== "") {
                    placename = `${placename} ${flag}`;
                }

                addMarker(placename, latitude, longitude, viewAltitude);
            }
        }
    } while (linkMatch);

    return markers;
}

// Sometimes in React you end up comparing data structures for various reasons.
// I can't say I'm super proud of this little beauty, but in order to keep from
// reassigning the same markers repeatedly, I implemented a conditional assignment
// in App.tsx. See the comment there.  This comparison method checks two arrays of
// marker objects to see if they're equivalent.  (NOT to see if they're identical.)
function markerArraysEqual(a1: Marker[], a2: Marker[]) {
    if (a1.length !== a2.length) {
        return false;
    }

    for (let i = 0; i < a1.length; i++) {
        if (!markersEqual(a1[i], a2[i])) {
            return false;
        }
    }

    return true;
}

function markersEqual(m1: Marker, m2: Marker) {
    return m1.position.lat === m2.position.lat &&
        m1.position.lng === m2.position.lng &&
        m1.label === m2.label &&
        m1.viewAltitude === m2.viewAltitude;
}

function position(latLng: google.maps.LatLng): Position {
    return { lat: latLng.lat(), lng: latLng.lng() };
}

function viewAltitudeToGoogleZoomLevel(altitude: number) {
    let zoomLevel = MAX_ZOOM_LEVEL - Math.round(altitude / ZOOM_RATIO);

    if (zoomLevel < MIN_ZOOM_LEVEL) {
        // This is the most zoomed-out we allow (for automatic zoom)
        zoomLevel = MIN_ZOOM_LEVEL;
    } else if (zoomLevel > MAX_ZOOM_LEVEL) {
        // This is the most zoomed-in we allow (for automatic zoom)
        zoomLevel = MAX_ZOOM_LEVEL;
    }

    return zoomLevel;
}

/*----------------------------------------------------------------------
 *                      EXPORTS
 */
export { extractMarkers, markerArraysEqual, smoothlyAnimatePanTo, viewAltitudeToGoogleZoomLevel };