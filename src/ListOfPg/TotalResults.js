import { Dropdown } from "react-bootstrap";
import SortIcon from "../images/SortIcon.png";
import { useEffect } from "react";
import "../Styles/TotalResults.css";
import { axiosInstance } from "../AxiosInstance";
import { useParams } from "react-router-dom";

export default function TotalResults({
	pgType,
	sharingType,
	budget,
	amenities,
	setOrder,
	totalPgs,
	setTotalPgs,
}) {
	const { location } = useParams();

	useEffect(() => {
		const fetchPgs = async () => {
			try {
				const response = await axiosInstance.post(
					`/pg_controller/getTotalCountByLocation/${location}`,
					new URLSearchParams({
						filterAmenities: JSON.stringify(amenities),
						filterPgType: pgType,
						filterBudget: JSON.stringify(budget),
						filterSharingType: sharingType,
					}),
					{
						headers: {
							Authorization:
								"Bearer " + sessionStorage.getItem("token"),
						},
					}
				);
				setTotalPgs(response.data.successmsg);
			} catch (error) {
				console.error("Error fetching Pgs:", error);
				return;
			}
		};

		fetchPgs();
	}, [location, pgType, sharingType, budget, amenities]);

	const setOrderValue = (value) => {
		setOrder(value);
	};

	return (
		<div className="totalResults">
			<div className="d-flex flex-row align-items-center justify-content-between">
				<div>
					<p className="results">Results Showing:</p>
					<div className="totalPgandLocation">
						<h3 className="totalPg">{totalPgs}</h3>
						{location && (
							<p className="locationName">Pg(s) in {location}</p>
						)}
					</div>
				</div>
				<Dropdown className="sort">
					<Dropdown.Toggle
						variant="primary"
						id="dropdown-basic"
						className="custom-dropdown-toggle"
					>
						<img
							src={SortIcon}
							className="sortIcon"
							alt="Sort Icon"
						/>
						<p className="sortText">Sort By</p>
						<svg
							style={{ order: 1, flexGrow: 0 }}
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
						>
							<path
								d="M12 15.0006L7.75732 10.758L9.17154 9.34375L12 12.1722L14.8284 9.34375L16.2426 10.758L12 15.0006Z"
								fill="#42526D"
							/>
						</svg>
					</Dropdown.Toggle>

					<Dropdown.Menu>
						<Dropdown.Item href="#/action-1">
							Relevance
						</Dropdown.Item>
						<Dropdown.Item onClick={() => setOrderValue("asc")}>
							Price: Low to High
						</Dropdown.Item>
						<Dropdown.Item onClick={() => setOrderValue("desc")}>
							Price: High to Low
						</Dropdown.Item>
					</Dropdown.Menu>
				</Dropdown>
			</div>
		</div>
	);
}
