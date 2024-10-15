import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import "../Styles/FoodMenuDetails.css";
import Header from "../Header";
import { useNavigate } from "react-router-dom";
import Legend from "./Legend";
import { axiosInstance } from "../AxiosInstance";

export default function FoodMenuDetails() {
	const foodMenu = JSON.parse(sessionStorage.getItem("foodMenu"));

	const navigate = useNavigate();

	const days = [
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
		"Sunday",
	];

	const foodTimes = ["Breakfast", "Lunch", "Dinner"];

	const [food, setFood] = useState(() => {
		const initialFoodState = {};
		days.forEach((day) => {
			initialFoodState[day] = {};
			foodTimes.forEach((time) => {
				initialFoodState[day][time] = foodMenu
					? foodMenu.food[day][time]
					: "";
			});
		});
		return initialFoodState;
	});

	const [isChecked, setIsChecked] = useState(() => {
		return foodMenu ? [...foodMenu.isChecked] : [];
	});

	const handleSubmit = async (e) => {
		e.preventDefault();

		await axiosInstance.post(
			"/food_menu_controller/add",
			new URLSearchParams({
				food: JSON.stringify(food),
				pg_id: sessionStorage.getItem("pg_id"),
			}),
			{
				headers: {
					Authorization: "Bearer " + sessionStorage.getItem("token"),
				},
			}
		);

		const foodMenu = { food, isChecked };

		sessionStorage.setItem("foodMenu", JSON.stringify(foodMenu));

		navigate("/ContactDetails");
	};

	const goBack = () => {
		navigate("/RoomsPhotosUpload");
	};

	const handleCheckboxChange = (value) => {
		setIsChecked((prevValue) => {
			if (prevValue.includes(value)) {
				return prevValue.filter((day) => day !== value);
			} else {
				return [...prevValue, value];
			}
		});
	};

	const foodChange = (day, time, value) => {
		setFood((prevFood) => ({
			...prevFood,
			[day]: { ...prevFood[day], [time]: value },
		}));
	};

	useEffect(() => {
		console.log(food);
	}, [food]);

	const getPageHeight = () => {
		if (isChecked.length < 2) {
			return "100vh";
		} else {
			return `${isChecked.length * 150 + 700}px`;
		}
	};

	return (
		<div className="food" style={{ height: getPageHeight() }}>
			<div className="header">
				<Header />
			</div>
			<div className="container" style={{ maxWidth: 1376 }}>
				<div
					className="d-flex flex-row"
					style={{ marginTop: 72, marginBottom: 348, gap: 24 }}
				>
					<Legend currentPage={6} />
					<div className="foodDetailsPage">
						<div className="backPage" onClick={goBack}>
							<svg
								className="backArrow"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M7.82843 10.9999H20V12.9999H7.82843L13.1924 18.3638L11.7782 19.778L4 11.9999L11.7782 4.22168L13.1924 5.63589L7.82843 10.9999Z"
									fill="#6B788E"
								/>
							</svg>
							<p className="back">Back</p>
						</div>

						<div className="foodDetails">
							<h2 className="detailHeading">Food Menu Details</h2>
							<p className="detail">
								Help property seekers to find you accurately
							</p>
						</div>

						<Form onSubmit={handleSubmit}>
							<Form.Group controlId="formPgType">
								<Form.Label
									column
									sm="4"
									className="daysQuestion"
								>
									On which days do you provide food?
								</Form.Label>
								<div
									className="d-flex flex-row"
									style={{ gap: 37 }}
								>
									{days.map((day, index) => {
										return (
											<Form.Check
												key={index}
												type="checkbox"
												style={{ cursor: "pointer" }}
												label={day}
												name={day}
												checked={
													isChecked.includes(day)
														? true
														: false
												}
												onChange={() =>
													handleCheckboxChange(day)
												}
											/>
										);
									})}
								</div>
							</Form.Group>

							{days.map((day) => {
								if (isChecked.includes(day)) {
									return (
										<div>
											<h2
												column
												sm="4"
												className="daysQuestion"
											>
												{day}
											</h2>
											<div
												className="d-flex flex-row"
												style={{ gap: 29 }}
											>
												{foodTimes.map((time, idx) => {
													return (
														<Form.Group
															className="food-form-group"
															key={time}
														>
															<Form.Label
																column
																sm="4"
																className="food-form-label"
															>
																{time}
															</Form.Label>
															<Form.Control
																type="text"
																name={time}
																value={
																	food[day][
																		time
																	]
																}
																className="food-form-control"
																onChange={(e) =>
																	foodChange(
																		day,
																		time,
																		e.target
																			.value
																	)
																}
															/>
														</Form.Group>
													);
												})}
											</div>
										</div>
									);
								} else {
									return null;
								}
							})}
							<Button
								variant="primary"
								type="submit"
								className="continueBtnFood"
							>
								Continue
							</Button>
						</Form>
					</div>
				</div>
			</div>
		</div>
	);
}
