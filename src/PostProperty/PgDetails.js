import { useState } from "react";
import { Button, Form, Row, Col, Dropdown } from "react-bootstrap";
import "../Styles/PgDetails.css";
import Header from "../Header";
import { useNavigate } from "react-router-dom";
import Legend from "./Legend";
import Amenities from "./Amenities";
import PgRules from "./PgRules";
import { axiosInstance } from "../AxiosInstance";

export default function PgDetails() {
	const allPgDetails = JSON.parse(sessionStorage.getItem("allPgDetails"));
	const roomSharingType = JSON.parse(
		sessionStorage.getItem("roomSharingType")
	);
	const [pg_type, setType] = useState(() => {
		return allPgDetails ? allPgDetails.pg_type : "";
	});
	const [sharingType, setSharingType] = useState(() => {
		return roomSharingType ? [...roomSharingType] : [];
	});
	const [notice_period, setSelectedNotice] = useState(() => {
		return allPgDetails
			? allPgDetails.updatedRules.notice_period
			: "1 Month";
	});
	const [gate_close_time, setSelectedGateTime] = useState(() => {
		return allPgDetails
			? allPgDetails.updatedRules.gate_close_time
			: "No Restriction";
	});
	const [description, setDescription] = useState(() => {
		return allPgDetails ? allPgDetails.description : "";
	});
	const [errorMessagePgType, setErrorMessagePgType] = useState("");
	const [errorMessageSharing, setErrorMessageSharing] = useState("");
	const [errorMessageDescription, setErrorMessageDescription] = useState("");
	const [amenities, setAmenities] = useState(() => {
		return allPgDetails
			? { ...allPgDetails.updatedAmenities }
			: {
					wifi: "Not Available",
					food: "Not Available",
					power_backup: "Not Available",
					parking: "Not Available",
					cleaning: "Daily",
					attached_washroom: "Not Available",
					air_conditioner: "Not Available",
					washing_machine: "Not Available",
			  };
	});

	const [pgRules, setPgRules] = useState(() => {
		return allPgDetails
			? { ...allPgDetails.updatedRules }
			: {
					smoking: "Not Allowed",
					drinking: "Not Allowed",
					loud_music: "Not Allowed",
					party: "Not Allowed",
					visitor_entry: "Not Allowed",
			  };
	});

	const [selectedCleaning, setSelectedCleaning] = useState(() => {
		return allPgDetails
			? allPgDetails.updatedAmenities.selectedCleaning
			: "Daily";
	});
	const navigate = useNavigate();

	const handlePgTypeChange = (type) => {
		setType(type);
		setErrorMessagePgType("");
	};

	const handleSharingTypeChange = (type) => {
		if (sharingType.includes(type)) {
			setSharingType(
				sharingType.filter((sharingType) => sharingType !== type)
			);
		} else {
			setSharingType([...sharingType, type]);
		}
		setErrorMessageSharing("");
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const isValid = validations();

		if (!isValid) {
			alert("There are errors in your response.");
			return;
		}

		const updatedRules = {
			...pgRules,
			gate_close_time: gate_close_time,
			notice_period: notice_period,
		};

		const updatedAmenities = { ...amenities, selectedCleaning };

		await axiosInstance.post(
			"/pg_controller/updatePgTypeAndDesc",
			new URLSearchParams({
				pg_id: sessionStorage.getItem("pg_id"),
				pg_type: pg_type,
				description: description,
			}),
			{
				headers: {
					Authorization: "Bearer " + sessionStorage.getItem("token"),
				},
			}
		);

		await axiosInstance.post(
			"/pg_rules_controller/add",
			{
				pg_id: sessionStorage.getItem("pg_id"),
				...updatedRules,
			},
			{
				headers: {
					Authorization: "Bearer " + sessionStorage.getItem("token"),
					"Content-Type": "application/json",
				},
			}
		);

		await axiosInstance.post(
			"/amenities_controller/add",
			{
				pg_id: sessionStorage.getItem("pg_id"),
				...updatedAmenities,
			},
			{
				headers: {
					Authorization: "Bearer " + sessionStorage.getItem("token"),
					"Content-Type": "application/json",
				},
			}
		);

		const allPgDetails = {
			pg_type,
			description,
			updatedAmenities,
			updatedRules,
		};

		sessionStorage.setItem("allPgDetails", JSON.stringify(allPgDetails));
		sessionStorage.setItem("roomSharingType", JSON.stringify(sharingType));

		navigate("/Pricing");
	};

	const handleNoticeSelect = (eventKey) => {
		setSelectedNotice(eventKey);
	};

	const handleGateTimeSelect = (eventKey) => {
		setSelectedGateTime(eventKey);
	};

	const goBack = () => {
		const updatedRules = {
			...pgRules,
			gate_close_time: gate_close_time,
			notice_period: notice_period,
		};

		const updatedAmenities = { ...amenities, selectedCleaning };

		const allPgDetails = {
			pg_type,
			description,
			updatedAmenities,
			updatedRules,
		};

		sessionStorage.setItem("allPgDetails", JSON.stringify(allPgDetails));
		sessionStorage.setItem("roomSharingType", JSON.stringify(sharingType));
		navigate("/PostProperty");
	};

	const validations = () => {
		if (pg_type.length === 0) {
			setErrorMessagePgType("Pg Type cannot be empty.");
			return false;
		} else {
			setErrorMessagePgType("");
		}

		if (sharingType.length === 0) {
			setErrorMessageSharing("Sharing Type cannot be empty.");
			return false;
		} else {
			setErrorMessageSharing("");
		}

		if (description.split(" ").length < 100) {
			setErrorMessageDescription(
				"Description cannot be less than 100 words."
			);
			return false;
		} else {
			setErrorMessageDescription("");
		}
		return true;
	};

	const handleCleaningSelect = (eventKey) => {
		setSelectedCleaning(eventKey);
	};

	const pgTypes = ["Boys", "Girls", "Coed"];

	const sharingOptions1 = [
		{ type: "Single", label: "Single Room" },
		{ type: "Double", label: "2 Sharing" },
		{ type: "Triple", label: "3 Sharing" },
	];

	const sharingOptions2 = [
		{ type: "Four", label: "4 Sharing" },
		{ type: "Other", label: "Others" },
	];
	const cleaningBasis = ["Daily", "Alternate Days", "Weekly"];

	const noticePeriods = ["1 Month", "2 Months", "3 Months"];

	const gateClosingTimes = ["No Restriction", "9 pm", "10 pm"];

	return (
		<div className="pgDetails">
			<div className="header">
				<Header />
			</div>
			<div className="container" style={{ maxWidth: 1376 }}>
				<div
					className="d-flex flex-row"
					style={{ marginTop: 72, marginBottom: 348, gap: 24 }}
				>
					<Legend currentPage={2} />
					<div className="details" style={{ padding: 40 }}>
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

						<div className="propertyDetails">
							<h2 className="detailHeading">Property Details</h2>
							<p className="detail">
								Help property seekers to make quick decision
							</p>
						</div>

						<Form onSubmit={handleSubmit}>
							<Form.Group
								controlId="formPgType"
								style={{ marginTop: 40 }}
							>
								{errorMessagePgType && (
									<p className="text-danger">
										{errorMessagePgType}
									</p>
								)}
								<Form.Label column sm="4" className="formLabel">
									Pg Type
								</Form.Label>
								<Row sm="8" style={{ marginTop: 20 }}>
									<Col
										sm="8"
										style={{ display: "flex", gap: "8px" }}
									>
										{pgTypes.map((pgType, index) => (
											<Button
												onClick={() =>
													handlePgTypeChange(pgType)
												}
												className="me-2 mb-2 pgType"
												key={pgType}
												style={{
													color:
														pgType === pg_type
															? "#2765DD"
															: "#7a8699",
													backgroundColor:
														pgType === pg_type
															? "#2765DD1A"
															: "#ffffff",
												}}
											>
												{pgType}
											</Button>
										))}
									</Col>
								</Row>
							</Form.Group>
							<Form.Group
								controlId="formSharingType"
								style={{ marginTop: 40 }}
							>
								{errorMessageSharing && (
									<p className="text-danger">
										{errorMessageSharing}
									</p>
								)}
								<Form.Label column sm="4" className="formLabel">
									Sharing Type
								</Form.Label>
								<Row sm="8" style={{ marginTop: 20 }}>
									<Col
										sm="8"
										style={{
											display: "flex",
											gap: "8px",
										}}
									>
										{sharingOptions1.map(
											(option, index) => (
												<label
													key={index}
													className="me-2 mb-2 sharingType"
													style={{
														width: `${
															option.type ===
															"Single"
																? 153
																: 130
														}px`,
													}}
												>
													<input
														type="checkbox"
														checked={sharingType.includes(
															option.type
														)}
														onChange={() =>
															handleSharingTypeChange(
																option.type
															)
														}
														style={{
															marginRight: "8px",
															cursor: "pointer",
														}}
													/>
													{option.label}
												</label>
											)
										)}
									</Col>
									<Col
										sm="8"
										style={{ display: "flex", gap: "8px" }}
									>
										{sharingOptions2.map(
											(option, index) => (
												<label
													key={index}
													className="me-2 mb-2 sharingType"
													style={{
														width: `${
															option.type ===
															"Other"
																? 113
																: 130
														}px`,
													}}
												>
													<input
														type="checkbox"
														checked={sharingType.includes(
															option.type
														)}
														onChange={() =>
															handleSharingTypeChange(
																option.type
															)
														}
														style={{
															marginRight: "8px",
															cursor: "pointer",
														}}
													/>
													{option.label}
												</label>
											)
										)}
									</Col>
								</Row>
							</Form.Group>

							<Amenities
								amenities={amenities}
								setAmenities={setAmenities}
							/>

							{amenities.cleaning === "Available" && (
								<Dropdown onSelect={handleCleaningSelect}>
									<Dropdown.Toggle
										variant="outline-secondary"
										id="dropdown-basic"
										className="d-flex justify-content-between align-items-center cleaningSelect"
									>
										<span className="cleaningLabel">
											Cleaning Basis
										</span>
										<span className="cleaningOption">
											{selectedCleaning}
										</span>
									</Dropdown.Toggle>
									<Dropdown.Menu>
										{cleaningBasis.map((basis) => (
											<Dropdown.Item
												eventKey={basis}
												key={basis}
											>
												{basis}
											</Dropdown.Item>
										))}
									</Dropdown.Menu>
								</Dropdown>
							)}
							<PgRules
								pgRules={pgRules}
								setPgRules={setPgRules}
							/>

							<Dropdown onSelect={handleNoticeSelect}>
								<Dropdown.Toggle
									variant="outline-secondary"
									id="dropdown-basic"
									className="d-flex justify-content-between align-items-center cleaningSelect"
								>
									<span className="cleaningLabel">
										Notice Period
									</span>
									<span className="cleaningOption">
										{notice_period}
									</span>
								</Dropdown.Toggle>

								<Dropdown.Menu>
									{noticePeriods.map((period) => (
										<Dropdown.Item
											eventKey={period}
											key={period}
										>
											{period}
										</Dropdown.Item>
									))}
								</Dropdown.Menu>
							</Dropdown>

							<Dropdown onSelect={handleGateTimeSelect}>
								<Dropdown.Toggle
									variant="outline-secondary"
									id="dropdown-basic"
									className="d-flex justify-content-between align-items-center cleaningSelect"
								>
									<span className="cleaningLabel">
										Gate Closing Time
									</span>
									<span className="cleaningOption">
										{gate_close_time}
									</span>
								</Dropdown.Toggle>

								<Dropdown.Menu>
									{gateClosingTimes.map((time) => (
										<Dropdown.Item
											eventKey={time}
											key={time}
										>
											{time}
										</Dropdown.Item>
									))}
								</Dropdown.Menu>
							</Dropdown>
							<Form.Group
								controlId="formPgType"
								style={{ marginTop: 40 }}
							>
								{errorMessageDescription && (
									<p className="text-danger">
										{errorMessageDescription}
									</p>
								)}
								<div className="d-flex flex-column align-items-start">
									<Form.Label
										column
										sm="4"
										className="formLabel"
									>
										Pg Description
									</Form.Label>
									<span className="min100">
										Min 100 Words
									</span>
									<Form.Control
										as="textarea"
										placeholder=""
										className="inputDesc"
										value={description}
										onChange={(e) =>
											setDescription(e.target.value)
										}
									/>
								</div>
							</Form.Group>
							<Button
								variant="primary"
								onClick={handleSubmit}
								className="continueBtn"
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
