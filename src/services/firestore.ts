// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	getDoc,
	getDocs,
	getFirestore,
	initializeFirestore,
} from "firebase/firestore";
import { Cave, Coordinate } from "../types/Cave.types";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyAjNsrMk2q1cufnyflWwzaUzUCCITphJ_w",
	authDomain: "cave-connect-a0989.firebaseapp.com",
	projectId: "cave-connect-a0989",
	storageBucket: "cave-connect-a0989.appspot.com",
	messagingSenderId: "306018837466",
	appId: "1:306018837466:web:f72f4d7af2dc780a8296e3",
	measurementId: "G-066831FPEH",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
export { db };

/////////////////// HOOKS TO INTERACT WITH FIRESTORE ///////////////////

export async function getAllCaves(): Promise<Cave[]> {
	try {
		const querySnapshot = await getDocs(collection(db, "caves"));

		let allCaves: Cave[] = [];

		allCaves = querySnapshot.docs.map((doc) => ({
			key: doc.id,
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

export async function getSingleCave(caveKey: string): Promise<Cave> {
	try {
		const docRef = doc(db, "caves", caveKey);
		const docSnap = await getDoc(docRef);

		let singleCave: Cave = {} as Cave;

		if (docSnap.exists()) {
			singleCave = {
				key: docSnap.id,
				name: docSnap.data().name,
				date_visited: docSnap.data().date_visited.toDate(),
				notes: docSnap.data().notes,
				location: {
					lat: docSnap.data().location.lat,
					lng: docSnap.data().location.lng,
				},
				description: docSnap.data().description,
			};
		}

		return singleCave;
	} catch (error: any) {
		console.log(error);
		return error;
	}
}

export async function getAllCoordinates(): Promise<Coordinate[]> {
	try {
		const querySnapshot = await getDocs(collection(db, "caves"));

		let allCoordinates: Coordinate[] = [];

		allCoordinates = querySnapshot.docs.map((doc) => ({
			lat: doc.data().location.lat,
			lng: doc.data().location.lng,
		}));

		return allCoordinates;
	} catch (error: any) {
		console.log(error);
		return error;
	}
}

export async function addCave(caveData: Cave): Promise<void> {
	try {
		caveData.location.lat = Number(caveData.location.lat);
		caveData.location.lng = Number(caveData.location.lng);

		await addDoc(collection(db, "caves"), caveData);
		console.log("wrote to DB successfully");
	} catch (error: any) {
		console.log(error);
		return error;
	}
}

export async function deleteCave(caveKey: string | undefined): Promise<void> {
	try {
		if (caveKey) {
			await deleteDoc(doc(db, "caves", caveKey));
			console.log(`deleted ${caveKey} from DB successfully`);
		}
	} catch (error: any) {
		console.log(error);
		return error;
	}
}
