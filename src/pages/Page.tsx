import {
	IonButtons,
	IonContent,
	IonHeader,
	IonMenuButton,
	IonPage,
	IonTitle,
	IonToolbar,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import AddCave from "../components/AddCave";
import AllCavesList from "../components/AllCavesList";
import "./Page.css";
import CaveComponent from "../components/SingleCave";
import AllCavesMap from "../components/AllCavesMap";

const Page: React.FC = () => {
	const { name, key } = useParams<{ name: string; key: string }>();
	const [friendlyName, setFriendlyName] = useState("");

	useEffect(() => {
		if (name === "add-cave") {
			setFriendlyName("Add Cave");
		} else if (name === "all-caves-list") {
			setFriendlyName("Caves List");
		} else if (name === "all-caves-map") {
			setFriendlyName("Caves Map");
		} else {
			setFriendlyName("");
		}

		document.title = friendlyName;
	}, [name, friendlyName]);

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot="start">
						<IonMenuButton />
					</IonButtons>
					<IonTitle>{friendlyName ? friendlyName : "Cave"}</IonTitle>
				</IonToolbar>
			</IonHeader>

			<IonContent fullscreen>
				{name === "add-cave" ? <AddCave name={name} friendlyName={friendlyName} /> : ""}
				{name === "all-caves-list" ? <AllCavesList friendlyName={friendlyName} /> : ""}
				{name === "all-caves-map" ? <AllCavesMap /> : ""}
				{key ? <CaveComponent caveKey={key} /> : ""}
			</IonContent>
		</IonPage>
	);
};

export default Page;
