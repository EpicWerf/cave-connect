export interface Cave {
	key?: string;
	name: string;
	date_visited: Date;
	description: string;
	location: {
		latitude: number;
		longitude: number;
	};
	notes: string;
}

export interface Position {
	lat: number;
	lng: number;
}

export interface Marker {
	position: Position;
	label: string;
	viewAltitude: number;
}
