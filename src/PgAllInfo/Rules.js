import "../Styles/Rules.css";
import { useEffect, useState } from "react";
import NoticePeriod from "../images/NoticePeriod.png";
import GateClosing from "../images/GateClosing.png";
import Smoking from "../images/Smoking.png";
import Drinking from "../images/Drinking.png";
import LoudMusic from "../images/LoudMusic.png";
import Party from "../images/Party.png";
import VisitorEntry from "../images/VisitorEntry.png";
import Available from "../images/Available.png";
import NotAvailable from "../images/NotAvailable.png";
import { axiosInstance } from "../AxiosInstance";

const allRules = [
	{ name: "Notice-Period", image: NoticePeriod },
	{ name: "Gate Close Time", image: GateClosing },
	{ name: "Smoking", image: Smoking },
	{ name: "Drinking", image: Drinking },
	{ name: "Loud-Music", image: LoudMusic },
	{ name: "Party", image: Party },
	{ name: "Visitor Entry", image: VisitorEntry },
];

export default function Rules() {
	const [rules, setRules] = useState([]);
	const [loading, setLoading] = useState(true);

	const pg_id = sessionStorage.getItem("pg_id");

	useEffect(() => {
		const fetchPgRules = async () => {
			try {
				const response = await axiosInstance.post(
					"/pg_rules_controller/getByPgId",
					new URLSearchParams({ pg_id: pg_id }),
					{
						headers: {
							Authorization:
								"Bearer " + sessionStorage.getItem("token"),
						},
					}
				);
				setRules(response.data);
				setLoading(false);
			} catch (error) {
				console.error("Error fetching Pg Rules: ", error);
			}
		};

		fetchPgRules();
	}, [pg_id]);

	useEffect(() => {
		console.log(rules);
	}, [rules]);

	const getStatusImage = (status) => {
		switch (status) {
			case "Not Allowed":
				return NotAvailable;
			case "Allowed":
				return Available;
			default:
				return null;
		}
	};

	const getColor = (status) => {
		switch (status) {
			case "Allowed":
				return "#e9f3ee";
			case "Not Allowed":
				return "#faebea";
			default:
				return "#ebedf0";
		}
	};

	if (loading) {
		return <div>Loading...</div>;
	}

	return (
		<section id="section-5">
			<h2 className="rules">PG Rules</h2>
			<div className="d-flex flex-row flex-wrap gap-2">
				{allRules.map(({ name, image }, index) => {
					const statusKey = name
						.toLowerCase()
						.replace(/ /g, "_")
						.replace("-", "_");
					const status = rules[0][statusKey];
					return (
						<div key={index} className="allowedRules">
							<h2 className="allRule">{name}</h2>
							<img
								src={image}
								alt={`${name}`}
								className="allRuleImages"
							/>
							<div
								className="rulesAvailability"
								style={{ backgroundColor: getColor(status) }}
							>
								<div className="rulesImgAndStatus">
									{(status === "Allowed" ||
										status === "Not Allowed") && (
										<img
											src={getStatusImage(status)}
											alt="Status"
											className="rulesStatusImg"
										/>
									)}
									<p className="rulesStatus">{status}</p>
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</section>
	);
}
