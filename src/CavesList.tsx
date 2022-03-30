import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "./firebaseConfig";

export const streamCaves = (snapshot: any, error: any) => {
	const cavesCollection = collection(db, "caves");
	const cavesQuery = query(cavesCollection);
	return onSnapshot(cavesQuery, snapshot, error);
};

function CavesList() {
	const [caves, setCaves] = useState<any[]>([]);
	const [error, setError] = useState<any>();

	useEffect(() => {
		const unsubscribe = streamCaves(
			(snapshot: any) => {
				const caves = snapshot.caves.map((doc: { data: () => any }) => doc.data());
				console.log(caves);
				setCaves(caves);
			},
			(error: any) => {
				setError(`Error getting caves ${error}`);
			}
		);
	});

	return (
		<>
			{caves.map((cave) => (
				<div>{cave.name}</div>
			))}
		</>
	);
}

export default CavesList;
