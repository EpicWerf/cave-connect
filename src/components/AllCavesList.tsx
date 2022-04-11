import {
	IonButton,
	IonCard,
	IonCardContent,
	IonContent,
	IonIcon,
	IonItem,
	IonLabel,
	IonList,
	IonSearchbar,
} from "@ionic/react";
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
	const [searchText, setSearchText] = useState("");

	useEffect(() => {
		const fetchCaves = async () => {
			const response = await getAllCaves();
			setCaves(response);
		};
		fetchCaves();
	}, []);

	return (
		<div className="container">
			<IonCard>
				<IonSearchbar
					value={searchText}
					onIonChange={(e) => setSearchText(e.detail.value!)}
					showCancelButton="focus"
				></IonSearchbar>
				{caves.map((cave) => (
					<IonList key={cave.key}>
						<IonItem href={`cave/${cave.key}`} className="ion-activated">
							<IonIcon icon={pin} slot="start" />
							<IonLabel>{cave.name}</IonLabel>
						</IonItem>
					</IonList>
				))}
				<IonItem>
					<IonButton
						className="ion-text-center"
						color="primary"
						fill="solid"
						size="default"
						onClick={() => (window.location.href = "/page/add-cave")}
					>
						Add New Cave
					</IonButton>
				</IonItem>
			</IonCard>
		</div>
	);
};

export default AllCavesList;
