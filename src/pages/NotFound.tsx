import {
	IonButtons,
	IonCard,
	IonCardTitle,
	IonContent,
	IonHeader,
	IonMenuButton,
	IonPage,
	IonTitle,
	IonToolbar,
} from "@ionic/react";
import { Player } from "@lottiefiles/react-lottie-player";
import { useEffect } from "react";
import "./NotFound.css";

const NotFound: React.FC = () => {
	useEffect(() => {
		document.title = "404 Not Found";
	}, []);

	return (
		<>
			<IonPage>
				<IonHeader>
					<IonToolbar>
						<IonButtons slot="start">
							<IonMenuButton />
						</IonButtons>
					</IonToolbar>
				</IonHeader>

				<IonContent>
					<IonCard className="not-found-card">
						<IonCardTitle className="ion-text-center">
							<Player
								autoplay
								loop
								src="https://assets3.lottiefiles.com/packages/lf20_u1xuufn3.json"
							></Player>
							Unable to find the requested web page, please verify and try again!
						</IonCardTitle>
					</IonCard>
				</IonContent>
			</IonPage>
		</>
	);
};

export default NotFound;
