async function geocodeLatLng(lat: number, lng: number) {
	const geocoder = new google.maps.Geocoder();
	const latlng = {
		lat: lat,
		lng: lng,
	};

	try {
		const result = await geocoder.geocode({ location: latlng });
		console.log(`Geocode success for ${lat}, ${lng}`);

		let resultString: string = result.results[1].formatted_address;
		if (result.results.length > 6) {
			resultString = result.results[7].formatted_address;
		}
		return resultString;
	} catch (error) {
		console.log(error);
		return "";
	}
}

export default geocodeLatLng;
