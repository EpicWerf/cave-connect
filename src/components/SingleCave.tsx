import {
	IonButton,
	IonCard,
	IonCardContent,
	IonCardHeader,
	IonCardSubtitle,
	IonCardTitle,
	IonItem,
} from "@ionic/react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { collection, onSnapshot, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db, deleteCave, getSingleCave } from "../services/firestore";
import { Cave } from "../types/Cave.types";
import "./AllCavesList.css";
import MapComponent from "./MapComponent";

export const streamCaves = (snapshot: any, error: any) => {
	const cavesCollection = collection(db, "caves");
	const cavesQuery = query(cavesCollection);
	return onSnapshot(cavesQuery, snapshot, error);
};

interface ContainerProps {
	caveKey: string;
}

const SingleCave: React.FC<ContainerProps> = ({ caveKey }) => {
	const [cave, setCave] = useState<Cave>();

	//delete the cave and send the user back to the list of caves
	const deleteCaveAndReturn = async (caveKey: string) => {
		await deleteCave(caveKey);
		window.location.href = "/page/all-caves-list";
	};

	useEffect(() => {
		const fetchSingleCave = async () => {
			const response = await getSingleCave(caveKey);
			setCave(response);
		};
		fetchSingleCave();
	}, [caveKey]);

	return (
		<div className="container">
			<IonCard>
				<img
					src="https://www.readersdigest.ca/wp-content/uploads/2020/05/bermuda-crystal-caves-1.jpg"
					alt="Cave"
				/>
				<IonCardHeader>
					<IonCardSubtitle>City, State</IonCardSubtitle>
					<IonCardTitle>{cave?.name}</IonCardTitle>
				</IonCardHeader>

				<IonCardContent>
					<IonItem color="none">Date Visited: {cave?.date_visited.toLocaleDateString()}</IonItem>
					<IonItem color="none">Description: {cave?.description}</IonItem>
					<IonItem color="none">Notes: {cave?.notes}</IonItem>
					<IonItem color="none">
						<IonButton
							className="delete-button"
							color="danger"
							fill="solid"
							size="default"
							onClick={() => deleteCaveAndReturn(caveKey)}
						>
							Delete {cave?.name}
						</IonButton>
					</IonItem>
					<MapComponent lat={parseFloat("40.270050079244854")} lng={parseFloat("-111.68148898577512")}></MapComponent>
					{/* <MapComponent lat={parseFloat(cave!.location.latitude)} lng={parseFloat(cave!.location.longitude)}></MapComponent> */}

				</IonCardContent>
			</IonCard>
		</div>
	);
};

export default SingleCave;
