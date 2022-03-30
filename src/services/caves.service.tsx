import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Cave } from "../types/Cave.types";

async function getAllCaves(): Promise<Cave[]> {
	try {
		const querySnapshot = await getDocs(collection(db, "caves"));

		let allCaves: Cave[] = [];
		allCaves = querySnapshot.docs.map((doc) => ({
			name: doc.data().name,
			date_visited: doc.data().date_visited,
			notes: doc.data().notes,
			location: doc.data().location,
			description: doc.data().description,
		}));

        return allCaves;
	} catch (error: any) {
		console.log(error);
		return error;
	}
}

export default getAllCaves;
