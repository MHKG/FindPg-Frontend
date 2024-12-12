import { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../Styles/RoomAvailability.css";
import Arrowhead from "../images/Arrowhead.png";
import { Button } from "react-bootstrap";
import { axiosInstance } from "../AxiosInstance";

export default function RoomAvailability() {
	const [rooms, setRooms] = useState([]);
	const [imagesSets, setImagesSets] = useState({});
	const [imageIndexes, setImageIndexes] = useState({});
	const [visibleRange, setVisibleRange] = useState({ start: 0, end: 4 });
	const pg_id = sessionStorage.getItem("pg_id");

	const CustomPrevArrow = ({ style, onClick }) => {
		return (
			<div
				className="arrowSlick"
				style={{ ...style }}
				onClick={onClick}
			/>
		);
	};

	const CustomNextArrow = ({ style, onClick }) => {
		return (
			<div
				className="arrowSlick"
				style={{ ...style, transform: "rotate(180deg)", left: 805 }}
				onClick={onClick}
			/>
		);
	};

	const settings = {
		dots: true,
		infinite: false,
		speed: 500,
		slidesToShow: 2,
		slidesToScroll: 1,
		prevArrow: <CustomPrevArrow />,
		nextArrow: <CustomNextArrow />,

		responsive: [
			{
				breakpoint: 1024,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 1,
					infinite: false,
					dots: true,
				},
			},
			{
				breakpoint: 600,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1,
					initialSlide: 1,
				},
			},
		],
	};

	useEffect(() => {
		const fetchPgRooms = async () => {
			try {
				const response = await axiosInstance.post(
					"/rooms_controller/getByPgId",
					new URLSearchParams({ pg_id: pg_id }),
					{
						headers: {
							Authorization:
								"Bearer " + sessionStorage.getItem("token"),
						},
					}
				);
				setRooms(response.data);
			} catch (error) {
				console.error("Error fetching Pg rooms: ", error);
			}
		};

		fetchPgRooms();
	}, [pg_id]);

	useEffect(() => {
		const fetchImagesForPg = async (room) => {
			try {
				const response = await axiosInstance.post(
					"/image_controller/getImagesByPgIdAndRoomId",
					new URLSearchParams({
						pg_id: pg_id,
						room_id: room.room_id,
					}),
					{
						headers: {
							Authorization:
								"Bearer " + sessionStorage.getItem("token"),
						},
					}
				);
				if (response.data.length > 4) {
					setVisibleRange({ start: 0, end: 4 });
				}
				return response.data;
			} catch (error) {
				console.error(
					`Error fetching images for PG ${room.room_id}:`,
					error
				);
				return [];
			}
		};

		if (rooms.length > 0) {
			const imageSets = {};
			const initialIndexes = {};

			Promise.all(
				rooms.map(async (room) => {
					const images = await fetchImagesForPg(room);
					imageSets[room.room_id] = images;
					initialIndexes[room.room_id] = 0;
				})
			).then(() => {
				setImagesSets(imageSets);
				setImageIndexes(initialIndexes);
			});
		}
	}, [rooms, pg_id]);

	const handlePrevious = (room_id) => {
		setImageIndexes((prevIndexes) => {
			const prevIndex = prevIndexes[room_id];
			const newIndex =
				prevIndex === 0
					? imagesSets[room_id].length - 1
					: prevIndex - 1;
			return { ...prevIndexes, [room_id]: newIndex };
		});
	};

	const handleNext = (room_id) => {
		setImageIndexes((prevIndexes) => {
			const prevIndex = prevIndexes[room_id];
			const newIndex =
				prevIndex === imagesSets[room_id].length - 1
					? 0
					: prevIndex + 1;
			return { ...prevIndexes, [room_id]: newIndex };
		});
	};

	const updateVisibleRange = (idx) => {
		const imagesCount = imagesSets.length;
		if (imagesCount <= 4) {
			setVisibleRange({ start: 0, end: imagesCount });
			return;
		}

		const totalVisibleDots = 4;
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

	const handleDotClick = (index, room_id) => {
		setImageIndexes((prevIndexes) => ({
			...prevIndexes,
			[room_id]: index,
		}));
		updateVisibleRange(index);
	};

	return (
		<section id="section-2">
			<h2 className="roomAvailability">Room Availability</h2>
			<div className="roomsDetails">
				<Slider {...settings}>
					{rooms.map((room, index) => {
						const room_id = room.room_id;
						const images = imagesSets[room_id] || [];
						const currentIndex = imageIndexes[room_id] || 0;

						return (
							<div className="imagesAndCost" key={room_id}>
								{images.length > 0 && (
									<div style={{ width: "auto", height: 172 }}>
										<img
											className="image"
											src={`http://localhost:8080/image_controller/${images[currentIndex].image}`}
											alt={`Room Image ${currentIndex}`}
										/>
										<div
											className="d-flex flex-row"
											style={{
												gap: 218,
												top: -108,
												position: "relative",
											}}
										>
											<Button
												onClick={() =>
													handlePrevious(room_id)
												}
												className="roomArrowButton"
												style={{
													borderRadius:
														"0px 32px 32px 0px",
												}}
											>
												<img
													className="roomImageArrow"
													src={Arrowhead}
													alt="Previous Image"
												/>
											</Button>
											<Button
												onClick={() =>
													handleNext(room_id)
												}
												className="roomArrowButton"
												style={{
													borderRadius:
														"32px 0px 0px 32px",
													padding: "6px 4px 6px 8px",
												}}
											>
												<img
													className="roomImageArrow"
													src={Arrowhead}
													style={{
														right: "5px",
														transform:
															"rotate(180deg)",
													}}
													alt="Next Image"
												/>
											</Button>
										</div>
										<div className="toggle-bar">
											{images
												.slice(
													visibleRange.start,
													visibleRange.end
												)
												.map((_, idx) => (
													<span
														key={idx}
														className={`dot ${
															currentIndex ===
															idx +
																visibleRange.start
																? "active"
																: ""
														}`}
														onClick={() =>
															handleDotClick(
																idx +
																	visibleRange.start,
																room_id
															)
														}
													/>
												))}
										</div>
									</div>
								)}
								<div className="typeAndCost">
									<p className="roomtype">{room.room_type}</p>
									<h2 className="roomcost">
										{"\u20b9 "} {room.cost}
									</h2>
								</div>
							</div>
						);
					})}
				</Slider>
			</div>
		</section>
	);
}
