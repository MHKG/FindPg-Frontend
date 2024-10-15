import React, { useState } from "react";
import Header from "../Header";
import "react-input-range/lib/css/index.css";
import "../Styles/ListOfPg.css";
import Filters from "./Filters";
import TotalResults from "./TotalResults";
import FetchPgDetails from "./FetchPgDetails";
import Navigators from "../Navigators";

export default function ListOfPg() {
	const [order, setOrder] = useState("");
	const [pgType, setPgType] = useState("");
	const [sharingType, setSharingType] = useState("");
	const [budget, setBudget] = useState([{ min: 0, max: 40000 }]);
	const [totalPgs, setTotalPgs] = useState(0);
	const [amenities, setAmenities] = useState([
		{
			wifi: "",
			food: "",
			power_backup: "",
			parking: "",
			attached_washroom: "",
			air_conditioner: "",
			washing_machine: "",
			cleaning: "",
		},
	]);

	const updatePgType = (type) => {
		setPgType(type);
	};

	const updateSharingType = (type) => {
		setSharingType(type);
	};

	const updateBudget = (type) => {
		setBudget(type);
	};

	const updateAmenities = (type) => {
		setAmenities(type);
	};

	return (
		<div className="listOfPg">
			<div className="header">
				<Header params={"inline-flex"} />
			</div>

			<div className="container" style={{ maxWidth: 1376 }}>
				<Navigators />
				<div
					className="d-flex flex-row"
					style={{ marginTop: 24, marginBottom: 348, gap: 24 }}
				>
					<Filters
						pgType={pgType}
						setPgType={updatePgType}
						sharingType={sharingType}
						setSharingType={updateSharingType}
						budget={budget}
						setBudget={updateBudget}
						amenities={amenities}
						setAmenities={updateAmenities}
					/>

					<div className="d-flex flex-column gap-4">
						<TotalResults
							pgType={pgType}
							sharingType={sharingType}
							budget={budget}
							amenities={amenities}
							setOrder={setOrder}
							totalPgs={totalPgs}
							setTotalPgs={setTotalPgs}
						/>
						<FetchPgDetails
							pgType={pgType}
							sharingType={sharingType}
							budget={budget}
							amenities={amenities}
							order={order}
							totalPgs={totalPgs}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
