import {
	IonButton,
	IonCard,
	IonCardContent,
	IonIcon,
	IonItem,
	IonItemOption,
	IonItemOptions,
	IonItemSliding,
	IonLabel,
	IonList,
	IonSearchbar,
} from "@ionic/react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db, deleteCave, getAllCaves } from "../services/firestore";
import { useEffect, useState } from "react";
import { Cave } from "../types/Cave.types";
import { pin } from "ionicons/icons";
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
		<>
			<IonCard>
				<IonSearchbar
					value={searchText}
					onIonChange={(e) => setSearchText(e.detail.value!)}
					showCancelButton="focus"
					className="ion-text-center"
				></IonSearchbar>
				<IonCardContent>
					<IonList className="container" lines="none" >
						{caves.map((cave) => (
							<IonItemSliding>
								<IonItem key={cave.key} href={`cave/${cave.key}`} className="ion-activated">
									<IonIcon icon={pin} slot="start" />
									<IonLabel>{cave.name}</IonLabel>
								</IonItem>
								<IonItemOptions side="end">
									<IonItemOption
										onClick={() => {
											deleteCave(cave.key);
										}}
										color="danger"
									>
										Delete
									</IonItemOption>
								</IonItemOptions>
							</IonItemSliding>
						))}
					</IonList>
				</IonCardContent>

				<IonButton
					className="add-button"
					color="primary"
					fill="solid"
					size="default"
					onClick={() => (window.location.href = "/page/add-cave")}
				>
					Add New Cave
				</IonButton>
			</IonCard>
		</>
	);
};

export default AllCavesList;
