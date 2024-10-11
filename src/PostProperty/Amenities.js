import ColourWifi from "../images/ColourWifi.png";
import Food from "../images/ColourFood.png";
import PowerBackup from "../images/ColourBackup.png";
import Parking from "../images/ColourParking.png";
import Cleaning from "../images/ColourCleaning.png";
import AttachedWashroom from "../images/ColourWashroom.png";
import AC from "../images/ColourAC.png";
import WashingMachine from "../images/ColourWashing.png";
import { Form } from "react-bootstrap";
import React from "react";

export default function Amenities({ amenities, setAmenities }) {
	const handleAmenitiesChange = (key) => {
		setAmenities((prevAmenities) => ({
			...prevAmenities,
			[key]:
				prevAmenities[key] === "Available"
					? "Not Available"
					: "Available",
		}));
	};

	return (
		<Form>
			<Form.Group controlId="formAmenities" style={{ marginTop: 40 }}>
				<Form.Label column sm="4" className="formLabel">
					Amenities
				</Form.Label>
				<div
					className="d-flex flex-column gap-2"
					style={{ marginTop: 20 }}
				>
					<div
						className="d-flex flex-row gap-2"
						style={{ gap: "8px" }}
					>
						<label className="mb-2 checkButtons">
							<div className="imageNameGroup">
								<img src={ColourWifi} alt="Wifi Icon" />
								<span className="name">Wi-fi</span>
							</div>
							<input
								type="checkbox"
								checked={amenities.wifi === "Available"}
								onChange={() => handleAmenitiesChange("wifi")}
								style={{ marginTop: 16, cursor: "pointer" }}
							/>
						</label>
						<label className="mb-2 checkButtons">
							<div className="imageNameGroup">
								<img src={Food} alt="Food Icon" />
								<span className="name">Food</span>
							</div>
							<input
								type="checkbox"
								checked={amenities.food === "Available"}
								onChange={() => handleAmenitiesChange("food")}
								style={{ marginTop: 16, cursor: "pointer" }}
							/>
						</label>
					</div>
					<div
						className="d-flex flex-row gap-2"
						style={{ gap: "8px" }}
					>
						<label className="mb-2 checkButtons">
							<div className="imageNameGroup">
								<img
									src={PowerBackup}
									alt="Power Backup Icon"
								/>
								<span className="name">Power Backup</span>
							</div>
							<input
								type="checkbox"
								checked={amenities.power_backup === "Available"}
								onChange={() =>
									handleAmenitiesChange("power_backup")
								}
								style={{ marginTop: 16, cursor: "pointer" }}
							/>
						</label>
						<label className="mb-2 checkButtons">
							<div className="imageNameGroup">
								<img src={Parking} alt="Parking Icon" />
								<span className="name">Parking</span>
							</div>
							<input
								type="checkbox"
								checked={amenities.parking === "Available"}
								onChange={() =>
									handleAmenitiesChange("parking")
								}
								style={{ marginTop: 16, cursor: "pointer" }}
							/>
						</label>
					</div>
					<div
						className="d-flex flex-row gap-2"
						style={{ gap: "8px" }}
					>
						<label className="mb-2 checkButtons">
							<div className="imageNameGroup">
								<img src={Cleaning} alt="Cleaning Icon" />
								<span className="name">Cleaning</span>
							</div>
							<input
								type="checkbox"
								checked={amenities.cleaning === "Available"}
								onChange={() =>
									handleAmenitiesChange("cleaning")
								}
								style={{ marginTop: 16, cursor: "pointer" }}
							/>
						</label>
						<label className="mb-2 checkButtons">
							<div className="imageNameGroup">
								<img
									src={AttachedWashroom}
									alt="Attached Washroom Icon"
								/>
								<span className="name">Attached Washroom</span>
							</div>
							<input
								type="checkbox"
								checked={
									amenities.attached_washroom === "Available"
								}
								onChange={() =>
									handleAmenitiesChange("attached_washroom")
								}
								style={{ marginTop: 16, cursor: "pointer" }}
							/>
						</label>
					</div>
					<div
						className="d-flex flex-row gap-2"
						style={{ gap: "8px" }}
					>
						<label className="mb-2 checkButtons">
							<div className="imageNameGroup">
								<img src={AC} alt="AC Icon" />
								<span className="name">Air Conditioner</span>
							</div>
							<input
								type="checkbox"
								checked={
									amenities.air_conditioner === "Available"
								}
								onChange={() =>
									handleAmenitiesChange("air_conditioner")
								}
								style={{ marginTop: 16, cursor: "pointer" }}
							/>
						</label>
						<label className="mb-2 checkButtons">
							<div className="imageNameGroup">
								<img
									src={WashingMachine}
									alt="Washing Machine Icon"
								/>
								<span className="name">Washing Machine</span>
							</div>
							<input
								type="checkbox"
								checked={
									amenities.washing_machine === "Available"
								}
								onChange={() =>
									handleAmenitiesChange("washing_machine")
								}
								style={{ marginTop: 16, cursor: "pointer" }}
							/>
						</label>
					</div>
				</div>
			</Form.Group>
		</Form>
	);
}
