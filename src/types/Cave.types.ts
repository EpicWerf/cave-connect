import { GeoPoint } from "firebase/firestore";

export interface Cave {
	// key: string;
	name: string;
	date_visited: Date;
	description: string;
	location: GeoPoint;
	notes: string;
}
