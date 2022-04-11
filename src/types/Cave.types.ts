export interface Cave {
	key?: string;
	name: string;
	date_visited: Date;
	description: string;
	location: {
		latitude: string;
		longitude: string;
	};
	notes: string;
}
