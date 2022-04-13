import {
	IonButton,
	IonCard,
	IonCardContent,
	IonCardHeader,
	IonCardSubtitle,
	IonCardTitle,
	IonItem,
	IonList,
} from "@ionic/react";
import { db, deleteCave, getSingleCave } from "../services/firestore";
import { collection, onSnapshot, query } from "firebase/firestore";
import geocodeLatLng from "../services/geocodeLatLng";
import { useEffect, useState } from "react";
import { Cave } from "../types/Cave.types";
import MapComponent from "./MapComponent";
import "./SingleCave.css";

export const streamCaves = (snapshot: any, error: any) => {
	const cavesCollection = collection(db, "caves");
	const cavesQuery = query(cavesCollection);
	return onSnapshot(cavesQuery, snapshot, error);
};

interface ContainerProps {
	caveKey: string;
}

const SingleCave: React.FC<ContainerProps> = ({ caveKey }) => {
	const [cave, setCave] = useState<Cave>({
		name: "",
		date_visited: new Date(),
		description: "",
		location: { lat: 0, lng: 0 },
		notes: "",
	});
	const [cityState, setCityState] = useState<string>();

	const deleteCaveAndReturn = async (caveKey: string) => {
		await deleteCave(caveKey);
		window.location.href = "/page/all-caves-list";
	};

	useEffect(() => {
		const getCityState = async (lat: number, lng: number) => {
			const cityState = await geocodeLatLng(lat, lng);
			setCityState(cityState);
		};
		getCityState(cave.location.lat, cave.location.lng);
	}, [cave]);

	useEffect(() => {
		const fetchSingleCave = async () => {
			const response = await getSingleCave(caveKey);
			setCave(response);
		};
		fetchSingleCave();
	}, [caveKey]);

	return (
		<>
			<IonCard>
				<img
					src="https://www.readersdigest.ca/wp-content/uploads/2020/05/bermuda-crystal-caves-1.jpg"
					alt="Cave"
				/>
				<IonCardHeader className="ion-text-center">
					<IonCardSubtitle>{cityState}</IonCardSubtitle>
					<IonCardTitle>{cave.name}</IonCardTitle>
				</IonCardHeader>

				<IonCardContent>
					<IonList lines="full">
						<IonItem>Date Visited: {cave.date_visited.toLocaleDateString()}</IonItem>
						<IonItem>Description: {cave.description}</IonItem>
						<IonItem>Notes: {cave.notes}</IonItem>
					</IonList>
				</IonCardContent>
				<IonButton
					className="delete-button"
					color="danger"
					fill="solid"
					size="default"
					onClick={() => deleteCaveAndReturn(caveKey)}
				>
					Delete {cave.name}
				</IonButton>
				<MapComponent
					locations={[cave.location]}
					name={cave.name}
					mapHeight={"400px"}
					mapWidth={"100%"}
					zoomLevel={10}
				></MapComponent>
			</IonCard>
		</>
	);
};

export default SingleCave;
