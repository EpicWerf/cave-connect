import { IonItem, IonLabel, IonInput, IonButton, IonTextarea } from "@ionic/react";
import { useState } from "react";
import { Redirect } from "react-router";
import { addCave } from "../services/firestore";
import { Cave } from "../types/Cave.types";
import "./AllCavesList.css";

interface ContainerProps {
	name: string;
	friendlyName: string;
}

const AddCave: React.FC<ContainerProps> = ({ name, friendlyName }) => {
	const [newCave, setNewCave] = useState<Cave>({
		name: "",
		date_visited: new Date(),
		description: "",
		location: { latitude: "", longitude: "" },
		notes: "",
	});
	const [submitted, setSubmitted] = useState(false);

	const submitForm = async (event: any) => {
		event?.preventDefault();

		try {
			console.log("newCave", newCave);

			const response: any = await addCave(newCave);
			setSubmitted(true);
			return response.json();
		} catch (error) {
			console.log(error);
		}
	};

	if (submitted) {
		return <Redirect push to="/page/all-caves-list" />;
	}

	return (
		<div className="container">
			<strong>{friendlyName}</strong>
			<form className="ion-padding" onSubmit={submitForm}>
				<IonItem>
					<IonLabel position="floating">Cave Name</IonLabel>
					<IonInput
						value={newCave.name}
						onIonChange={(e: any) => setNewCave({ ...newCave, name: e.target.value })}
					/>
				</IonItem>
				<IonItem>
					<IonLabel>Date Visited</IonLabel>
					<input type={"date"} className="ion-text-end" />
				</IonItem>
				<IonItem>
					<IonLabel position="floating">Latitude</IonLabel>
					<IonInput
						value={newCave.location.latitude}
						onIonChange={(e: any) =>
							setNewCave({
								...newCave,
								location: { latitude: e.target.value, longitude: newCave.location.longitude },
							})
						}
					/>
				</IonItem>
				<IonItem>
					<IonLabel position="floating">Longitude</IonLabel>
					<IonInput
						value={newCave.location.longitude}
						onIonChange={(e: any) =>
							setNewCave({
								...newCave,
								location: { longitude: e.target.value, latitude: newCave.location.latitude },
							})
						}
					/>
				</IonItem>
				<IonItem>
					<IonLabel position="floating">Description</IonLabel>
					<IonTextarea
						value={newCave.description}
						onIonChange={(e: any) => setNewCave({ ...newCave, description: e.target.value })}
					/>
				</IonItem>
				<IonItem>
					<IonLabel position="floating">Additional Notes</IonLabel>
					<IonTextarea
						value={newCave.notes}
						onIonChange={(e: any) => setNewCave({ ...newCave, notes: e.target.value })}
					/>
				</IonItem>
				<IonButton className="ion-margin-top" type="submit" expand="block">
					Add Cave
				</IonButton>
			</form>
		</div>
	);
};

export default AddCave;
