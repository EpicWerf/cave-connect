import {
	IonContent,
	IonIcon,
	IonItem,
	IonLabel,
	IonList,
	IonListHeader,
	IonMenu,
	IonMenuToggle,
} from "@ionic/react";

import { useLocation } from "react-router-dom";
import {
	mapOutline,
	mapSharp,
	flagOutline,
	flagSharp,
	addCircleOutline,
	addCircleSharp,
} from "ionicons/icons";
import "./Menu.css";

interface AppPage {
	url: string;
	iosIcon: string;
	mdIcon: string;
	title: string;
}

const appPages: AppPage[] = [
	{
		title: "Caves List",
		url: "/page/all-caves-list",
		iosIcon: flagOutline,
		mdIcon: flagSharp,
	},
	{
		title: "Caves Map",
		url: "/page/all-caves-map",
		iosIcon: mapOutline,
		mdIcon: mapSharp,
	},
	{
		title: "Add New Cave",
		url: "/page/add-cave",
		iosIcon: addCircleOutline,
		mdIcon: addCircleSharp,
	},
];

const Menu: React.FC = () => {
	const location = useLocation();

	return (
		<IonMenu contentId="main" type="overlay">
			<IonContent>
				<IonList id="inbox-list">
					<IonListHeader>Menu</IonListHeader>
					{appPages.map((appPage, index) => {
						return (
							<IonMenuToggle key={index} autoHide={false}>
								<IonItem
									className={location.pathname === appPage.url ? "selected" : ""}
									routerLink={appPage.url}
									routerDirection="none"
									lines="none"
									detail={false}
								>
									<IonIcon slot="start" ios={appPage.iosIcon} md={appPage.mdIcon} />
									<IonLabel>{appPage.title}</IonLabel>
								</IonItem>
							</IonMenuToggle>
						);
					})}
				</IonList>
			</IonContent>
		</IonMenu>
	);
};

export default Menu;
