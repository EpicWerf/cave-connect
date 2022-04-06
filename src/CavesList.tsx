import { collection, onSnapshot, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db, getAllCaves } from "./services/firestore";
// import getAllCaves from "./services/caves.service";
import { Cave } from "./types/Cave.types";

export const streamCaves = (snapshot: any, error: any) => {
	const cavesCollection = collection(db, "caves");
	const cavesQuery = query(cavesCollection);
	return onSnapshot(cavesQuery, snapshot, error);
};

function CavesList() {
	const [caves, setCaves] = useState<Cave[]>([]);
	const [error, setError] = useState<any>();

	useEffect(() => {
		const fetchCaves = async () => {
			const response = await getAllCaves();
			setCaves(response);
		};
        fetchCaves();
	}, []);

	return (
		<>
			{caves.map((cave) => (
				<div>
					<div>{cave.name}</div>
					<div>{cave.description}</div>
				</div>
			))}
		</>
	);
}

export default CavesList;
