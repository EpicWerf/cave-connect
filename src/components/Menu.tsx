import {
	IonContent,
	IonIcon,
	IonItem,
	IonLabel,
	IonList,
	IonListHeader,
	IonMenu,
	IonMenuToggle,
	IonNote,
} from "@ionic/react";

import { useLocation } from "react-router-dom";
import {
	archiveOutline,
	archiveSharp,
	bookmarkOutline,
	heartOutline,
	heartSharp,
	mailOutline,
	mailSharp,
	paperPlaneOutline,
	paperPlaneSharp,
	trashOutline,
	trashSharp,
	warningOutline,
	warningSharp,
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
		title: "Sign In",
		url: "/page/all-caves-list",
		iosIcon: mailOutline,
		mdIcon: mailSharp,
	},
	{
		title: "All Caves List",
		url: "/page/all-caves-list",
		iosIcon: mailOutline,
		mdIcon: mailSharp,
	},
	{
		title: "All Caves List",
		url: "/page/all-caves-list",
		iosIcon: mailOutline,
		mdIcon: mailSharp,
	},
	{
		title: "All Caves Map",
		url: "/page/all-caves-map",
		iosIcon: heartOutline,
		mdIcon: heartSharp,
	},
	{
		title: "Add New Cave",
		url: "/page/add-cave",
		iosIcon: paperPlaneOutline,
		mdIcon: paperPlaneSharp,
	},
];

const labels = ["Family", "Friends", "Notes", "Work", "Travel", "Reminders"];

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

				<IonList id="labels-list">
					<IonListHeader>Labels</IonListHeader>
					{labels.map((label, index) => (
						<IonItem lines="none" key={index}>
							<IonIcon slot="start" icon={bookmarkOutline} />
							<IonLabel>{label}</IonLabel>
						</IonItem>
					))}
				</IonList>
			</IonContent>
		</IonMenu>
	);
};

export default Menu;
