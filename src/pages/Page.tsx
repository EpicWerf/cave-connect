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
import CavesList from "../components/AllCavesList";
import AddCave from "../components/AddCave";
import AllCavesList from "../components/AllCavesList";
import "./Page.css";
import CaveComponent from "../components/CaveComponent";

const Page: React.FC = () => {
	const { name, key } = useParams<{ name: string; key: string }>();
	const [friendlyName, setFriendlyName] = useState("");

	useEffect(() => {
		if (name === "add-cave") {
			setFriendlyName("Add Cave");
		} else if (name === "all-caves-list") {
			setFriendlyName("All Caves List");
		} else if (name === "all-caves-map") {
			setFriendlyName("All Caves Map");
		} else if (name === "sign-in") {
			setFriendlyName("Sign In");
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
					<IonTitle>{friendlyName}</IonTitle>
				</IonToolbar>
			</IonHeader>

			<IonContent fullscreen>
				<IonHeader collapse="condense">
					<IonToolbar>
						<IonTitle size="large">{friendlyName}</IonTitle>
					</IonToolbar>
				</IonHeader>
				{name === "add-cave" ? <AddCave name={name} friendlyName={friendlyName} /> : ""}
				{name === "all-caves-list" ? <AllCavesList friendlyName={friendlyName} /> : ""}
				{key ? <CaveComponent caveKey={key} /> : ""}
			</IonContent>
		</IonPage>
	);
};

export default Page;
