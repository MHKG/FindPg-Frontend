import { useEffect, useState } from "react";
import { axiosInstance } from "./AxiosInstance";
import "./Styles/Navigators.css";

export default function Navigators() {
	const [navigators, setNavigators] = useState(null);
	const [pgDetails, setPgDetails] = useState([]);
	const [loading, setLoading] = useState(true);
	const [pageTitle, setPageTitle] = useState("");

	const userSearchLocation = sessionStorage.getItem("userSearchLocation");
	const pg_id = sessionStorage.getItem("pg_id");

	useEffect(() => {
		const path = window.location.pathname;
		const title = path
			.substring(path.lastIndexOf("/") + 1)
			.replace(/%20/g, " ");
		if (path.includes("ListOfPg")) {
			setPageTitle(title);
		}
	}, []);

	useEffect(() => {
		const fetchPgDetails = async () => {
			if (pg_id !== null) {
				try {
					const response = await axiosInstance.post(
						"/pg_controller/getByPgId",
						new URLSearchParams({ pg_id: pg_id }),
						{
							headers: {
								Authorization:
									"Bearer " + sessionStorage.getItem("token"),
							},
						}
					);
					setPgDetails(response.data);
				} catch (error) {
					console.error("Error fetching PG details:", error);
				} finally {
					setLoading(false);
				}
			} else {
				setLoading(false);
			}
		};

		fetchPgDetails();
	}, [pg_id]);

	useEffect(() => {
		setNavigators(
			<>
				<a href="/" className="navigators">
					Home
				</a>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
				>
					<path
						d="M12.1717 12.0005L9.34326 9.17203L10.7575 7.75781L15.0001 12.0005L10.7575 16.2431L9.34326 14.8289L12.1717 12.0005Z"
						fill="#6B788E"
					/>
				</svg>
				<a
					href={
						window.location.href.includes("FetchAllPgByOwner")
							? "/FetchAllPgByOwner"
							: `/ListOfPg/${userSearchLocation}`
					}
					style={{
						color: window.location.href.includes("PgAllInfo")
							? "#2765dd"
							: "#6b788e",
					}}
					className="navigators"
				>
					{userSearchLocation &&
					window.location.href.includes("FetchAllPgByOwner")
						? "All Pgs"
						: userSearchLocation}
				</a>
				{window.location.href.includes("PgAllInfo") && !loading && (
					<>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
						>
							<path
								d="M12.1717 12.0005L9.34326 9.17203L10.7575 7.75781L15.0001 12.0005L10.7575 16.2431L9.34326 14.8289L12.1717 12.0005Z"
								fill="#6B788E"
							/>
						</svg>
						<a
							style={{
								color: "#6B788E",
							}}
							className="navigators"
						>
							{pgDetails[0]?.pg_name}
						</a>
					</>
				)}
			</>
		);
	}, [pg_id, userSearchLocation, pgDetails, loading, pageTitle]);

	if (pg_id !== null && loading) {
		return <div>Loading...</div>;
	}

	return <div style={{ marginTop: 24 }}>{navigators}</div>;
}
