export interface Cave {
	key?: string;
	name: string;
	date_visited: Date;
	description: string;
	location: Coordinate;
	notes: string;
}

export interface Coordinate {
	lat: number;
	lng: number;
}

export interface Marker {
	position: Coordinate;
	label: string;
	viewAltitude: number;
}
