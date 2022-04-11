import { IonButton, IonCard, IonIcon, IonItem, IonLabel, IonTitle } from "@ionic/react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { pin } from "ionicons/icons";
import { useEffect, useState } from "react";
import { db, getAllCaves } from "../services/firestore";
import { Cave } from "../types/Cave.types";
import "./AllCavesList.css";

export const streamCaves = (snapshot: any, error: any) => {
	const cavesCollection = collection(db, "caves");
	const cavesQuery = query(cavesCollection);
	return onSnapshot(cavesQuery, snapshot, error);
};

interface ContainerProps {
	friendlyName: string;
}

const AllCavesList: React.FC<ContainerProps> = ({ friendlyName }) => {
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
		<div className="container">
			<IonTitle className="ion-text-center">{friendlyName}</IonTitle>
			<IonCard>
				{caves.map((cave) => (
					<div key={cave.key}>
						<IonItem href={`cave/${cave.key}`} className="ion-activated">
							<IonIcon icon={pin} slot="start" />
							<IonLabel>{cave.name}</IonLabel>
						</IonItem>
					</div>
				))}
				<IonItem color="none">
					<IonButton
						className="delete-button"
						color="primary"
						fill="solid"
						size="default"
						onClick={() => window.location.href = "/page/add-cave"}
					> Add New Cave
					</IonButton>
				</IonItem>
			</IonCard>
		</div>
	);
};

export default AllCavesList;
