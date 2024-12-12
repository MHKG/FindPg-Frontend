import { Button } from "react-bootstrap";
import "../Styles/DetailsOfAPg.css";
import MapIcon from "../images/MapIcon.png";
import Arrowhead from "../images/Arrowhead.png";
import { useEffect, useState } from "react";
import { axiosInstance } from "../AxiosInstance";
import DetailsNavigationBar from "./DetailsNavigationBar";

export default function DetailsOfAPg() {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [pgDetails, setPgDetails] = useState({});
	const [rooms, setRooms] = useState([]);
	const [images, setImages] = useState([]);
	const [loading, setLoading] = useState(true);
	const [visibleRange, setVisibleRange] = useState({ start: 0, end: 6 });

	const pg_id = sessionStorage.getItem("pg_id");

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [pgDetailsResponse, roomsResponse, imagesResponse] =
					await Promise.all([
						axiosInstance.post(
							"/pg_controller/getByPgId",
							new URLSearchParams({ pg_id: pg_id }),
							{
								headers: {
									Authorization:
										"Bearer " +
										sessionStorage.getItem("token"),
								},
							}
						),
						axiosInstance.post(
							"/rooms_controller/getByPgId",
							new URLSearchParams({ pg_id: pg_id }),
							{
								headers: {
									Authorization:
										"Bearer " +
										sessionStorage.getItem("token"),
								},
							}
						),
						axiosInstance.post(
							"/image_controller/getByPgId",
							new URLSearchParams({ pg_id: pg_id }),
							{
								headers: {
									Authorization:
										"Bearer " +
										sessionStorage.getItem("token"),
								},
							}
						),
					]);

				setPgDetails(pgDetailsResponse.data);
				setRooms(roomsResponse.data);
				setImages(imagesResponse.data);
				if (imagesResponse.data.length > 6) {
					setVisibleRange({ start: 0, end: 6 });
				}
				setLoading(false);
			} catch (error) {
				console.error("Error fetching Data: ", error);
				setLoading(false);
				return;
			}
		};

		fetchData();
	}, [pg_id]);

	const getColorBackground = (type) => {
		switch (type) {
			case "Boys":
				return "#47cbdd4d";
			case "Girls":
				return "#dd47c54d";
			default:
				return "#ddbc474d";
		}
	};

	const getColorText = (type) => {
		switch (type) {
			case "Boys":
				return "#2b8a97";
			case "Girls":
				return "#c842b3";
			default:
				return "#a58f43";
		}
	};

	const getMinCost = (rooms) => {
		return rooms.reduce(
			(minCost, room) => (room.cost < minCost ? room.cost : minCost),
			Number.MAX_SAFE_INTEGER
		);
	};

	const handlePrevious = () => {
		setCurrentIndex((prevIndex) => {
			const newIndex =
				prevIndex === 0 ? images.length - 1 : prevIndex - 1;
			if (images.length > 6) {
				updateVisibleRange(newIndex);
			}
			return newIndex;
		});
	};

	const handleNext = () => {
		setCurrentIndex((prevIndex) => {
			const newIndex =
				prevIndex === images.length - 1 ? 0 : prevIndex + 1;
			if (images.length > 6) {
				updateVisibleRange(newIndex);
			}
			return newIndex;
		});
	};

	const updateVisibleRange = (idx) => {
		const imagesCount = images.length;
		if (imagesCount <= 6) {
			setVisibleRange({ start: 0, end: imagesCount });
			return;
		}

		const totalVisibleDots = 6;
		const halfRange = Math.floor(totalVisibleDots / 2);

		let start = Math.max(0, idx - halfRange);
		let end = Math.min(imagesCount, idx + halfRange);

		if (end - start < totalVisibleDots) {
			if (start === 0) {
				end = Math.min(imagesCount, start + totalVisibleDots);
			} else if (end === imagesCount) {
				start = Math.max(0, end - totalVisibleDots);
			}
		}

		setVisibleRange({ start, end });
	};

	const handleDotClick = (index) => {
		setCurrentIndex(index);
		updateVisibleRange(index);
	};

	if (loading) {
		return <div>Loading...</div>;
	}

	return (
		<div className="detailsOfPg">
			<div
				className="pgtype"
				style={{ background: getColorBackground(pgDetails[0].pg_type) }}
			>
				<p
					className="typeText"
					style={{ color: getColorText(pgDetails[0].pg_type) }}
				>
					{pgDetails[0].pg_type}
				</p>
			</div>

			<div className="d-flex flex-row align-items-center">
				<div className="pgNameAndLocation">
					<h2 className="pgName">{pgDetails[0].pg_name}</h2>
					<p className="location">{pgDetails[0].location}</p>
				</div>

				<div className="startFrom">
					<p className="startText">Starts From</p>
					<h2 className="cost">
						{"\u20b9 "}
						{getMinCost(rooms)}
					</h2>
				</div>
				<Button className="viewOnMapBtn">
					<div className="viewOnMap">
						<img src={MapIcon} className="mapIcon" alt="Map Icon" />
						<span className="viewOnMapText">View On Map</span>
					</div>
				</Button>
			</div>

			{images.length > 0 && (
				<div
					style={{
						width: "832px",
						height: "478px",
						marginBottom: 17,
					}}
				>
					<img
						className="detailImages"
						src={`http://localhost:8080/image_controller/${images[currentIndex].image}`}
						alt={`PG Image ${currentIndex}`}
					/>
					{images.length > 1 && (
						<>
							<div
								className="d-flex flex-row"
								style={{
									position: "relative",
									top: "-249px",
									gap: "744px",
								}}
							>
								<Button
									onClick={handlePrevious}
									className="imageDetailArrows"
									style={{
										borderRadius: "0px 32px 32px 0px",
									}}
								>
									<img
										className="arrow"
										src={Arrowhead}
										alt="Image shifter"
									/>
								</Button>
								<Button
									onClick={handleNext}
									className="imageDetailArrows"
									style={{
										padding: "6px 4px 6px 8px",
										right: "28px",
										borderRadius: "32px 0px 0px 32px",
									}}
								>
									<img
										className="arrow"
										src={Arrowhead}
										style={{
											right: "5px",
											transform: "rotate(180deg)",
										}}
										alt="Image shifter"
									/>
								</Button>
							</div>
							<div
								className="toggle-bar"
								style={{ marginLeft: 354, marginRight: 378 }}
							>
								{images
									.slice(visibleRange.start, visibleRange.end)
									.map((_, idx) => (
										<span
											key={idx}
											className={`dot ${
												currentIndex ===
												idx + visibleRange.start
													? "active"
													: ""
											}`}
											onClick={() =>
												handleDotClick(
													idx + visibleRange.start
												)
											}
										/>
									))}
							</div>
						</>
					)}
				</div>
			)}
			<DetailsNavigationBar props={pg_id} />
		</div>
	);
}
