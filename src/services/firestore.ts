// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { collection, getDocs, getFirestore, initializeFirestore } from "firebase/firestore";
import { Cave } from "../types/Cave.types";
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
const db = getFirestore(app)
export { db };

/////////////////// HOOKS TO INTERACT WITH FIRESTORE ///////////////////

export async function getAllCaves(): Promise<Cave[]> {
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
