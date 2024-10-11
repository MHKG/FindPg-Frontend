import "../Styles/AvailableAmenities.css";
import { useEffect, useState } from "react";
import Wifi from "../images/ColourWifi.png";
import Food from "../images/ColourFood.png";
import PowerBackup from "../images/ColourBackup.png";
import Parking from "../images/ColourParking.png";
import Cleaning from "../images/ColourCleaning.png";
import AttachedWashroom from "../images/ColourWashroom.png";
import AC from "../images/ColourAC.png";
import WashingMachine from "../images/ColourWashing.png";
import Available from "../images/Available.png";
import NotAvailable from "../images/NotAvailable.png";
import { axiosInstance } from "../AxiosInstance";

export default function AvailableAmenities({ setFoodAvailable }) {
	const [amenities, setAmenities] = useState([]);
	const [loading, setLoading] = useState(true);

	const pg_id = sessionStorage.getItem("pg_id");

	useEffect(() => {
		const fetchPgAmenities = async () => {
			try {
				const response = await axiosInstance.post(
					"/amenities_controller/getByPgId",
					new URLSearchParams({ pg_id: pg_id }),
					{
						headers: {
							Authorization:
								"Bearer " + sessionStorage.getItem("token"),
						},
					}
				);
				setAmenities(response.data);
				setLoading(false);
			} catch (error) {
				console.error("Error fetching Pg Amenities: ", error);
				return;
			}
		};

		fetchPgAmenities();
	}, [pg_id]);

	useEffect(() => {
		if (amenities.length > 0 && amenities[0].food === "Available") {
			setFoodAvailable(true);
		} else {
			setFoodAvailable(false);
		}
	}, [amenities]);

	const allAmenities = [
		"Wi-fi",
		"Food",
		"Power Backup",
		"Parking",
		"Cleaning",
		"Attached Washroom",
		"Air Conditioner",
		"Washing Machine",
	];

	const allImages = [
		Wifi,
		Food,
		PowerBackup,
		Parking,
		Cleaning,
		AttachedWashroom,
		AC,
		WashingMachine,
	];

	const getStatus = (status) => {
		if (status === "Not Available") {
			return NotAvailable;
		} else {
			return Available;
		}
	};

	const getColor = (status) => {
		if (status === "Not Available") {
			return "#faebea";
		} else {
			return "#e9f3ee";
		}
	};

	if (loading) {
		return <div>Loading...</div>;
	}

	return (
		<section id="section-4">
			<h2 className="amenities">Amenities</h2>
			<div className="d-flex flex-row flex-wrap gap-2">
				{allAmenities.map((allAmenity, index) => {
					const statusKey = allAmenity
						.toLowerCase()
						.replace(/ /g, "_")
						.replace("-", "");
					const status = amenities[0][statusKey] || "Not Available";
					return (
						<div key={index}>
							<div className="availableAmenities">
								<h2 className="allAmenity">{allAmenity}</h2>
								<img
									src={allImages[index]}
									className="allAmenityImages"
									alt={`Amenities ${index}`}
								/>
								<div
									className="availability"
									style={{
										backgroundColor: getColor(status),
									}}
								>
									<div className="imgAndStatus">
										<img
											src={getStatus(status)}
											alt="Status"
											className="statusImg"
										/>
										<p className="status">
											{status === "Not Available"
												? "Not Available"
												: "Available"}
										</p>
									</div>
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</section>
	);
}
