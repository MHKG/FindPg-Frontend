import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import "../Styles/Pricing.css";
import Header from "../Header";
import { useNavigate } from "react-router-dom";
import Legend from "./Legend";
import { axiosInstance } from "../AxiosInstance";

export default function Pricing() {
	const allPrices = JSON.parse(sessionStorage.getItem("allPrices"));

	const [prices, setPrices] = useState(() => {
		return allPrices
			? { ...allPrices.prices }
			: {
					price1Sharing: "",
					price2Sharing: "",
					price3Sharing: "",
					price4Sharing: "",
					priceOtherSharing: "",
					deposit: "",
					maintenance: "",
					electric_charges: "",
			  };
	});
	const [isChecked, setIsChecked] = useState(() => {
		return allPrices
			? { ...allPrices.isChecked }
			: {
					maintenance: false,
					electric: false,
			  };
	});
	const [roomTypes, setRoomTypes] = useState(() => {
		return allPrices ? [...allPrices.roomTypes] : [];
	});
	const [errorMessages, setErrorMessages] = useState({});
	const navigate = useNavigate();

	useEffect(() => {
		const sharingType = JSON.parse(
			sessionStorage.getItem("roomSharingType")
		);
		if (sharingType) {
			setRoomTypes(sharingType);
		}
	}, []);

	const validateFields = () => {
		let isValid = true;
		const errors = {};

		roomTypes.forEach((roomType, index) => {
			const priceKey = `price${index + 1}Sharing`;
			if (!prices[priceKey]) {
				errors[priceKey] = "This field is required";
				isValid = false;
			}
		});

		if (!prices.deposit) {
			errors.deposit = "This field is required";
			isValid = false;
		}

		if (isChecked.maintenance && !prices.maintenance) {
			errors.maintenance = "This field is required";
			isValid = false;
		}

		if (isChecked.electric && !prices.electric_charges) {
			errors.electric_charges = "This field is required";
			isValid = false;
		}

		setErrorMessages(errors);
		return isValid;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!validateFields()) return;

		try {
			await axiosInstance.post(
				"/pg_controller/updatePgPrices",
				new URLSearchParams({
					pg_id: sessionStorage.getItem("pg_id"),
					deposit: prices.deposit,
					maintenance: prices.maintenance,
					electric_charges: prices.electric_charges,
				}),
				{
					headers: {
						Authorization:
							"Bearer " + sessionStorage.getItem("token"),
					},
				}
			);

			const pricingDetails = roomTypes.reduce((acc, roomType, index) => {
				const priceKey = `price${index + 1}Sharing`;
				acc[roomType] = prices[priceKey];
				return acc;
			}, {});

			const roomData = roomTypes.map((roomType, index) => ({
				pg_id: sessionStorage.getItem("pg_id"),
				room_type: roomType,
				cost: pricingDetails[roomType],
			}));

			const roomsResponse = await axiosInstance.post(
				"/rooms_controller/add",
				roomData,
				{
					headers: {
						Authorization:
							"Bearer " + sessionStorage.getItem("token"),
					},
				}
			);

			const allPrices = { prices, isChecked, roomTypes };

			sessionStorage.setItem("allPrices", JSON.stringify(allPrices));

			sessionStorage.setItem(
				"roomDetails",
				JSON.stringify(roomsResponse.data)
			);

			navigate("/PgPhotosUpload");
		} catch (error) {
			console.error("Error during submission:", error);
		}
	};

	const goBack = () => {
		const allPrices = { prices, isChecked, roomTypes };

		sessionStorage.setItem("allPrices", JSON.stringify(allPrices));

		navigate("/PgDetails");
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setPrices((prev) => ({ ...prev, [name]: value }));
	};

	const handleCheckboxChange = (e) => {
		const { name, checked } = e.target;
		setIsChecked((prev) => ({ ...prev, [name]: checked }));
	};

	return (
		<div className="pricing">
			<div className="header">
				<Header />
			</div>
			<div className="container" style={{ maxWidth: 1376 }}>
				<div
					className="d-flex flex-row"
					style={{ marginTop: 72, marginBottom: 348, gap: 24 }}
				>
					<Legend currentPage={3} />
					<div className="pricingDetailsPage">
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

						<div className="pricingDetails">
							<h2 className="detailHeading">Pricing Details</h2>
							<p className="detail">
								Help property seekers to find you accurately
							</p>
						</div>

						<Form onSubmit={handleSubmit}>
							<Form.Group
								controlId="formPgType"
								style={{ paddingTop: 40 }}
							>
								<div className="d-flex flex-column">
									<Form.Label
										column
										sm="4"
										className="formLabel"
									>
										Monthly Pricing
									</Form.Label>
									{roomTypes.map((roomType, index) => {
										const priceKey = `price${
											index + 1
										}Sharing`;
										return (
											<Form.Group
												className="pricing-form-group"
												key={index}
											>
												{errorMessages[priceKey] && (
													<div className="text-danger">
														{
															errorMessages[
																priceKey
															]
														}
													</div>
												)}
												<Form.Label className="pricing-form-label">
													Monthly Rent - {roomType}{" "}
													Room
												</Form.Label>
												<Form.Control
													type="text"
													name={priceKey}
													value={prices[priceKey]}
													onChange={handleInputChange}
													className="pricing-form-control"
												/>
											</Form.Group>
										);
									})}
								</div>
								<Form.Label
									column
									sm="4"
									className="formLabel"
									style={{ paddingTop: 40 }}
								>
									Other Pricing
								</Form.Label>
								<Form.Group className="pricing-form-group">
									{errorMessages.deposit && (
										<div className="text-danger">
											{errorMessages.deposit}
										</div>
									)}
									<Form.Label className="pricing-form-label">
										Deposit
									</Form.Label>
									<Form.Control
										type="text"
										name="deposit"
										value={prices.deposit}
										onChange={handleInputChange}
										className="pricing-form-control"
									/>
								</Form.Group>
								<Form.Group
									className="pricing-form-group"
									style={{
										border: "none",
									}}
								>
									<Form.Label className="maintenanceQuestion">
										Do you collect Maintenance Fees?
									</Form.Label>
									<div className="d-flex flex-row gap-3">
										<Form.Check
											type="checkbox"
											label="Yes"
											name="maintenance"
											checked={isChecked.maintenance}
											onChange={handleCheckboxChange}
										/>
										<Form.Check
											type="checkbox"
											label="No"
											name="maintenance"
											checked={!isChecked.maintenance}
											onChange={handleCheckboxChange}
										/>
									</div>
								</Form.Group>
								{isChecked.maintenance && (
									<Form.Group
										className="pricing-form-group"
										style={{}}
									>
										{errorMessages.maintenance && (
											<div className="text-danger">
												{errorMessages.maintenance}
											</div>
										)}
										<Form.Label className="pricing-form-label">
											Maintenance Fee
										</Form.Label>
										<Form.Control
											type="text"
											name="maintenance"
											value={prices.maintenance}
											onChange={handleInputChange}
											className="pricing-form-control"
										/>
									</Form.Group>
								)}
								<Form.Group
									className="pricing-form-group"
									style={{
										border: "none",
									}}
								>
									<Form.Label className="maintenanceQuestion">
										Do you collect Electricity Charges?
									</Form.Label>
									<div className="d-flex flex-row gap-3">
										<Form.Check
											type="checkbox"
											label="Yes"
											name="electric"
											checked={isChecked.electric}
											onChange={handleCheckboxChange}
										/>
										<Form.Check
											type="checkbox"
											label="No"
											name="electric"
											checked={!isChecked.electric}
											onChange={handleCheckboxChange}
										/>
									</div>
								</Form.Group>
								{isChecked.electric && (
									<Form.Group className="pricing-form-group">
										{errorMessages.electric_charges && (
											<div className="text-danger">
												{errorMessages.electric_charges}
											</div>
										)}
										<Form.Label className="pricing-form-label">
											Electricity Charges
										</Form.Label>
										<Form.Control
											type="text"
											name="electric_charges"
											value={prices.electric_charges}
											onChange={handleInputChange}
											className="pricing-form-control"
										/>
									</Form.Group>
								)}
							</Form.Group>
							<Button
								variant="primary"
								type="submit"
								className="continueBtnPricing"
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
