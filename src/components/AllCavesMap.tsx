import { useEffect, useState } from "react";
import { getAllCoordinates } from "../services/firestore";
import { Coordinate } from "../types/Cave.types";
import "./AllCavesMap.css";
import MapComponent from "./MapComponent";

interface ContainerProps {}

const AllCavesMap: React.FC<ContainerProps> = () => {
	const [isLoaded, setIsLoaded] = useState(false);
	const [allCoordinates, setAllCoordinates] = useState<Coordinate[]>([]);

	useEffect(() => {
		const fetchAllCoordinates = async () => {
			const response = await getAllCoordinates();
			setAllCoordinates(response);
			setIsLoaded(true);
		};
		fetchAllCoordinates();
	}, []);

	return (
		<>
			{isLoaded ? (
				<MapComponent
					locations={allCoordinates}
					name={undefined}
					mapHeight={"100%"}
					mapWidth={"100%"}
					zoomLevel={5}
				/>
			) : (
				"Loading Map..."
			)}
		</>
	);
};

export default AllCavesMap;
