import { useEffect, useState } from "react";
import "../Styles/Description.css";
import { axiosInstance } from "../AxiosInstance";

export default function Description() {
	const [pgDetails, setPgDetails] = useState([]);
	const [pgRules, setPgRules] = useState([]);
	const [pgAmenities, setPgAmenities] = useState([]);
	const [loading, setLoading] = useState(true);

	const pg_id = sessionStorage.getItem("pg_id");

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [
					pgDetailsResponse,
					pgRulesResponse,
					pgAmenitiesResponse,
				] = await Promise.all([
					axiosInstance.post(
						"/pg_controller/getByPgId",
						new URLSearchParams({ pg_id: pg_id }),
						{
							headers: {
								Authorization:
									"Bearer " + sessionStorage.getItem("token"),
							},
						}
					),
					axiosInstance.post(
						"/pg_rules_controller/getByPgId",
						new URLSearchParams({ pg_id: pg_id }),
						{
							headers: {
								Authorization:
									"Bearer " + sessionStorage.getItem("token"),
							},
						}
					),
					axiosInstance.post(
						"/amenities_controller/getByPgId",
						new URLSearchParams({ pg_id: pg_id }),
						{
							headers: {
								Authorization:
									"Bearer " + sessionStorage.getItem("token"),
							},
						}
					),
				]);
				setPgDetails(pgDetailsResponse.data);
				setPgRules(pgRulesResponse.data);
				setPgAmenities(pgAmenitiesResponse.data);
				setLoading(false);
			} catch (error) {
				console.error("Error fetching Data: ", error);
				return;
			}
		};

		fetchData();
	}, [pg_id]);

	if (loading) {
		return <div>Loading...</div>;
	}

	return (
		<section id="section-1">
			<h2 className="nameOfPg">{pgDetails[0].pg_name}</h2>
			<p className="description">{pgDetails[0].description}</p>

			<div
				className="d-grid gap-2"
				style={{ gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr" }}
			>
				<div className="desc">
					<div className="descData">
						<p className="descTitle">Deposit</p>
						<p className="descText">
							{"\u20b9 "}
							{pgDetails[0].deposit}
						</p>
					</div>
				</div>

				<div className="desc">
					<div className="descData">
						<p className="descTitle">Notice Period</p>
						<p className="descText">{pgRules[0].notice_period}</p>
					</div>
				</div>

				<div className="desc">
					<div className="descData">
						<p className="descTitle">Maintenance</p>
						<p className="descText">
							{"\u20b9 "}
							{pgDetails[0].maintenance}
						</p>
					</div>
				</div>

				<div className="desc">
					<div className="descData">
						<p className="descTitle">Electric Charges</p>
						<p className="descText">
							{pgDetails[0].electric_charges === ""
								? "N/A"
								: "\u20b9 " + pgDetails[0].electric_charges}
						</p>
					</div>
				</div>

				<div className="desc">
					<div className="descData">
						<p className="descTitle">AC</p>
						<p className="descText">
							{pgAmenities[0].air_conditioner}
						</p>
					</div>
				</div>

				<div className="desc">
					<div className="descData">
						<p className="descTitle">Food Availability</p>
						<p className="descText">{pgAmenities[0].food}</p>
					</div>
				</div>

				<div className="desc">
					<div className="descData">
						<p className="descTitle">Backup</p>
						<p className="descText">
							{pgAmenities[0].power_backup}
						</p>
					</div>
				</div>

				<div className="desc">
					<div className="descData">
						<p className="descTitle">Parking</p>
						<p className="descText">{pgAmenities[0].parking}</p>
					</div>
				</div>

				<div className="desc">
					<div className="descData">
						<p className="descTitle">Cleaning</p>
						<p className="descText">{pgAmenities[0].cleaning}</p>
					</div>
				</div>

				<div className="desc">
					<div className="descData">
						<p className="descTitle">Washroom</p>
						<p className="descText">
							{pgAmenities[0].attached_washroom}
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}
