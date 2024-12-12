import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import Arrowhead from "../images/Arrowhead.png";
import Calendar from "../images/Calendar.png";
import Phone from "../images/Phone.png";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../AxiosInstance";

export default function SimilarPGs({ order, setSimilarPgsAvailable }) {
	const [pgDetails, setPgDetails] = useState([]);
	const [allPgDetails, setAllPgDetails] = useState([]);
	const [imageIndexes, setImageIndexes] = useState({});
	const [allRooms, setAllRooms] = useState({});
	const [visibleRange, setVisibleRange] = useState({ start: 0, end: 5 });
	const [loading, setLoading] = useState(true);

	const navigate = useNavigate();

	const pg_id = sessionStorage.getItem("pg_id");

	useEffect(() => {
		const fetchPgDetails = async () => {
			try {
				const response = await axiosInstance.post(
					`/pg_controller/getByPgId`,
					new URLSearchParams({
						pg_id: pg_id,
					}),
					{
						headers: {
							Authorization:
								"Bearer " + sessionStorage.getItem("token"),
						},
					}
				);

				setPgDetails(response.data);
				setLoading(false);
			} catch (error) {
				console.error("Error fetching PG details:", error);
			}
		};

		fetchPgDetails();
	}, [pg_id]);

	useEffect(() => {
		const fetchPgs = async () => {
			if (pgDetails.length === 0) {
				return;
			}
			try {
				const response = await axiosInstance.post(
					`/pg_controller/getAllBySimilarity`,
					new URLSearchParams({
						pg_type: pgDetails[0].pg_type,
						location: pgDetails[0].location,
					}),
					{
						headers: {
							Authorization:
								"Bearer " + sessionStorage.getItem("token"),
						},
					}
				);

				const data = response.data;
				const aggregatedData = data.reduce((acc, row) => {
					if (parseInt(pg_id) !== row[0]) {
						if (!acc[row[0]]) {
							acc[row[0]] = {
								pg_id: row[0],
								pg_name: row[1],
								pg_type: row[2],
								location: row[3],
								amenities: {
									wifi: row[4],
									food: row[5],
									power_backup: row[6],
									parking: row[7],
									attached_washroom: row[8],
									air_conditioner: row[9],
									washing_machine: row[10],
									cleaning: row[11],
								},
								images: [],
								minCost: row[13],
							};
						}

						if (row[12]) {
							acc[row[0]].images.push(row[12]);
						}
					}

					return acc;
				}, {});

				const sortedArray = Object.values(aggregatedData).sort((a, b) =>
					order === "desc"
						? b.minCost - a.minCost
						: a.minCost - b.minCost
				);

				setAllPgDetails(sortedArray);
				if (sortedArray.length === 0) {
					setSimilarPgsAvailable(false);
				}

				const initialIndexes = sortedArray.reduce((acc, pgDetail) => {
					acc[pgDetail.pg_id] = 0;
					return acc;
				}, {});
				setImageIndexes(initialIndexes);
			} catch (error) {
				console.error("Error fetching PG details:", error);
			}
		};

		fetchPgs();
	}, [pgDetails]);

	useEffect(() => {
		const fetchAllPgRooms = async () => {
			try {
				const roomsResponse = await Promise.all(
					allPgDetails.map(
						(pgDetail) =>
							axiosInstance.post(
								"/rooms_controller/getByPgId",
								new URLSearchParams({ pg_id: pgDetail.pg_id }),
								{
									headers: {
										Authorization:
											"Bearer " +
											sessionStorage.getItem("token"),
									},
								}
							),
						{
							headers: {
								Authorization:
									"Bearer " + sessionStorage.getItem("token"),
							},
						}
					)
				);
				const rooms = roomsResponse.reduce((acc, response, idx) => {
					acc[allPgDetails[idx].pg_id] = response.data;
					return acc;
				}, {});
				setAllRooms(rooms);
			} catch (error) {
				console.error("Error fetching images: ", error);
				return;
			}
		};
		if (allPgDetails.length > 0) {
			fetchAllPgRooms();
		}
	}, [allPgDetails]);

	const handlePrevious = (pg_id) => {
		setImageIndexes((prevIndexes) => {
			const currentIndex = prevIndexes[pg_id] || 0;
			const images = allPgDetails.find((pg) => pg.pg_id === pg_id).images;
			const newIndex = (currentIndex - 1 + images.length) % images.length;

			updateVisibleRange(pg_id, newIndex);

			return {
				...prevIndexes,
				[pg_id]: newIndex,
			};
		});
	};

	const handleNext = (pg_id) => {
		setImageIndexes((prevIndexes) => {
			const currentIndex = prevIndexes[pg_id] || 0;
			const images = allPgDetails.find((pg) => pg.pg_id === pg_id).images;
			const newIndex = (currentIndex + 1) % images.length;

			updateVisibleRange(pg_id, newIndex);

			return {
				...prevIndexes,
				[pg_id]: newIndex,
			};
		});
	};

	if (allPgDetails.images) {
		return <p>Loading Images...</p>;
	}

	const getColorBackground = (type) => {
		if (type === "Boys") {
			return "#47cbdd4d";
		} else if (type === "Girls") {
			return "#dd47c54d";
		} else {
			return "#ddbc474d";
		}
	};

	const getColorText = (type) => {
		if (type === "Boys") {
			return "#2b8a97";
		} else if (type === "Girls") {
			return "#c842b3";
		} else {
			return "#a58f43";
		}
	};

	const pgAllInfo = (pg_id) => {
		sessionStorage.setItem("pg_id", pg_id);
		navigate("/PgAllInfo");
	};

	const goToImage = (pg_id, imageIndex) => {
		setImageIndexes((prevIndexes) => ({
			...prevIndexes,
			[pg_id]: imageIndex,
		}));
	};

	const handleDotClick = (pg_id, idx) => {
		goToImage(pg_id, idx);
		updateVisibleRange(pg_id, idx);
	};

	const updateVisibleRange = (pg_id, idx) => {
		const imagesCount =
			allPgDetails.find((pg) => pg.pg_id === pg_id)?.images.length || 0;

		if (imagesCount <= 5) {
			setVisibleRange({ start: 0, end: imagesCount });
			return;
		}

		const totalVisibleDots = 5;
		const halfRange = Math.floor(totalVisibleDots / 2);

		let start = Math.max(0, idx - halfRange);
		let end = Math.min(imagesCount, idx + halfRange + 1);

		if (end - start < totalVisibleDots) {
			if (start === 0) {
				end = Math.min(imagesCount, start + totalVisibleDots);
			} else if (end === imagesCount) {
				start = Math.max(0, end - totalVisibleDots);
			}
		}

		setVisibleRange({ start, end });
	};

	if (loading && allPgDetails.length > 0) {
		return <div>Loading...</div>;
	}

	return (
		<section id="section-6" style={{ paddingBottom: 64, paddingTop: 52 }}>
			<h2 className="rules" style={{ width: 117 }}>
				Similar PGs
			</h2>
			{allPgDetails.length !== 0 ? (
				allPgDetails.map((pgDetail, index) => {
					const pg_id = pgDetail.pg_id;
					const currentIndex = imageIndexes[pg_id] || 0;
					const amenities = pgDetail.amenities || {};
					const images = pgDetail.images;
					const rooms = allRooms[pg_id] || [];

					return (
						<div
							className="pg"
							key={pg_id}
							style={{
								marginBottom: `${
									index + 1 === allPgDetails.length ? 0 : 28
								}px`,
							}}
						>
							<div className="d-flex flex-row">
								<div className="imageContainer">
									<img
										className="pgImages"
										src={`http://localhost:8080/image_controller/${images[currentIndex]}`}
										alt={`PG Image ${index}`}
									/>
									<div
										className="d-flex flex-row"
										style={{
											gap: 212,
											position: "relative",
											top: -181,
										}}
									>
										<Button
											onClick={() =>
												handlePrevious(pg_id, index)
											}
											className="imageArrows"
											style={{
												borderRadius:
													"0px 32px 32px 0px",
											}}
										>
											<img
												className="arrow"
												src={Arrowhead}
												alt="Image shifter"
											/>
										</Button>
										<Button
											onClick={() =>
												handleNext(pg_id, index)
											}
											className="imageArrows"
											style={{
												padding: "6px 4px 6px 8px",
												borderRadius:
													"32px 0px 0px 32px",
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
									<div className="toggle-bar">
										{images.map((_, idx) => {
											const imagesCount =
												allPgDetails.flatMap(
													(pgDetail) =>
														pgDetail.images
												).length;

											if (imagesCount <= 5) {
												return (
													<span
														key={idx}
														className={`dot ${
															idx === currentIndex
																? "active"
																: ""
														}`}
														onClick={() =>
															handleDotClick(
																pg_id,
																idx
															)
														}
													/>
												);
											}

											const isVisible =
												(idx >= visibleRange.start &&
													idx < visibleRange.end) ||
												idx === currentIndex;

											return (
												isVisible && (
													<span
														key={idx}
														className={`dot ${
															idx === currentIndex
																? "active"
																: ""
														}`}
														onClick={() =>
															handleDotClick(
																pg_id,
																idx
															)
														}
													/>
												)
											);
										})}
									</div>
								</div>
								<div
									className="data"
									onClick={() => pgAllInfo(pg_id)}
								>
									<div className="d-flex flex-column">
										<div
											className="d-flex flex-row"
											style={{ gap: 247 }}
										>
											<div className="nameAndLocation">
												<h2 className="namePgDetails">
													{pgDetail.pg_name}
												</h2>
												<p className="locationPgDetails">
													{pgDetail.location}
												</p>
											</div>
											<div
												className="type"
												style={{
													background:
														getColorBackground(
															pgDetail.pg_type
														),
												}}
											>
												<p
													className="pgTypeDetails"
													style={{
														color: getColorText(
															pgDetail.pg_type
														),
													}}
												>
													{pgDetail.pg_type}
												</p>
											</div>
										</div>

										<div
											className="d-flex flex-row align-items-center"
											style={{
												gap: 12,
												marginTop: 20,
												paddingBottom: 24,
												borderBottom:
													"1.5px solid #ebedf0",
											}}
										>
											{rooms.map((room, index) => {
												return (
													room.room_type !==
														"Other" && (
														<div
															key={index}
															className="d-flex flex-row align-items-center"
														>
															<hr className="roomsLineBreaker" />
															<div className="roomDetails">
																<div className="typeAndPrice">
																	<p className="roomType">
																		{
																			room.room_type
																		}
																	</p>
																	<p className="roomPrice">
																		₹{" "}
																		{
																			room.cost
																		}
																	</p>
																</div>
															</div>
														</div>
													)
												);
											})}
										</div>

										<div
											className="d-flex flex-row align-items-center"
											style={{
												borderBottom:
													"1.5px solid rgb(235, 237, 240)",
											}}
										>
											<div
												className="amenitiesPgs"
												style={{ paddingLeft: 0 }}
											>
												<h2
													className="amenitiesTitle"
													style={{ width: 99 }}
												>
													Food Availability
												</h2>
												<h2 className="amenitiesAvailability">
													{amenities.food ===
													"Available"
														? "Yes"
														: "No"}
												</h2>
											</div>

											<div className="amenitiesPgs">
												<h2 className="amenitiesTitle">
													Backup
												</h2>
												<h2 className="amenitiesAvailability">
													{amenities.power_backup ===
													"Available"
														? "Yes"
														: "No"}
												</h2>
											</div>

											<div className="amenitiesPgs">
												<h2 className="amenitiesTitle">
													Parking
												</h2>
												<h2 className="amenitiesAvailability">
													{amenities.parking ===
													"Available"
														? "Yes"
														: "No"}
												</h2>
											</div>

											<div className="amenitiesPgs">
												<h2
													className="amenitiesTitle"
													style={{ width: 84 }}
												>
													Cleaning
												</h2>
												<h2 className="amenitiesAvailability">
													{amenities.cleaning}
												</h2>
											</div>

											<div
												className="amenitiesPgs"
												style={{ borderRight: "none" }}
											>
												<h2 className="amenitiesTitle">
													Washroom
												</h2>
												<h2 className="amenitiesAvailability">
													{amenities.attached_washroom ===
													"Available"
														? "Attached"
														: "Common"}
												</h2>
											</div>
										</div>

										<div
											className="d-flex flex-row align-items-center"
											style={{ gap: 32, marginTop: 24 }}
										>
											<div className="startingPrice">
												<p className="startsFrom">
													Starts from
												</p>
												<p className="minCost">
													{"\u20b9 "}
													{pgDetail.minCost}
												</p>
											</div>

											<div className="contactButtons">
												<Button className="visitBtn">
													<div className="visitBtnDiv">
														<img
															src={Calendar}
															className="calendarImg"
															alt="Calendar"
														/>
														<span className="scheduleVisitText">
															Schedule Visit
														</span>
													</div>
												</Button>
												<Button className="contactBtn">
													<div className="contactBtnDiv">
														<img
															src={Phone}
															className="phoneImg"
															alt="Phone"
														/>
														<span className="contactText">
															Contact
														</span>
													</div>
												</Button>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					);
				})
			) : (
				<div>No Similar PGs available</div>
			)}
		</section>
	);
}
