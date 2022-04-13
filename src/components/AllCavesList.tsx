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
import { deleteCave, getAllCaves } from "../services/firestore";
import { useEffect, useState } from "react";
import { Cave } from "../types/Cave.types";
import { pin } from "ionicons/icons";
import "./AllCavesList.css";

interface ContainerProps {
	friendlyName: string;
}

const AllCavesList: React.FC<ContainerProps> = ({ friendlyName }) => {
	const [caves, setCaves] = useState<Cave[]>([]);
	const [searchText, setSearchText] = useState("");
	const [filteredCaves, setFilteredCaves] = useState<Cave[]>([]);

	//Handle search filtering
	useEffect(() => {
		let tempSearchResult = caves.filter((ele) =>
			ele.name.toLowerCase().includes(searchText.toLowerCase())
		);
		setFilteredCaves([...tempSearchResult]);
	}, [searchText, caves]);

	//Get all caves from firestore
	useEffect(() => {
		const fetchCaves = async () => {
			const response = await getAllCaves();
			setCaves(response);
		};
		fetchCaves();
	}, []);

	const deleteCaveAndReturn = async (caveKey: string | undefined) => {
		await deleteCave(caveKey);
		window.location.href = "/page/all-caves-list";
	};

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
					<IonList className="container" lines="none">
						{filteredCaves.map((cave) => (
							<IonItemSliding key={cave.key}>
								<IonItem href={`cave/${cave.key}`} className="ion-activated">
									<IonIcon icon={pin} slot="start" />
									<IonLabel>{cave.name}</IonLabel>
								</IonItem>
								<IonItemOptions side="end">
									<IonItemOption onClick={() => deleteCaveAndReturn(cave.key)} color="danger">
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
