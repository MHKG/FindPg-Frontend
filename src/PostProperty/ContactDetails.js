import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import "../Styles/ContactDetails.css";
import Header from "../Header";
import { useNavigate } from "react-router-dom";
import Legend from "./Legend";
import PropertyPostedPopup from "./PropertyPostedPopup";
import { axiosInstance } from "../AxiosInstance";
import { validate } from "../GlobalFunctions";

export default function ContactDetails() {
	const contactPersonDetails = JSON.parse(
		sessionStorage.getItem("contactPersonDetails")
	);

	const [contact_person_name, setName] = useState(() => {
		return contactPersonDetails
			? contactPersonDetails.contact_person_name
			: "";
	});
	const [contact_person_phone_number, setPhoneNumber] = useState(() => {
		return contactPersonDetails
			? contactPersonDetails.contact_person_phone_number
			: "";
	});
	const [errorMessageName, setErrorMessageName] = useState("");
	const [errorMessagePhone, setErrorMessagePhone] = useState("");
	const [propertyPosted, setPropertyPosted] = useState(false);
	const navigate = useNavigate();

	const handleSubmit = async () => {
		if (contact_person_name.length === 0) {
			setErrorMessageName("Name cannot be empty.");
			return;
		} else {
			setErrorMessageName("");
		}

		const phoneRegex = /^(\+91)?[6789]\d{9}$/;

		if (!phoneRegex.test(contact_person_phone_number)) {
			setErrorMessagePhone("Invalid Phone Number.");
			return;
		} else {
			setErrorMessagePhone("");
		}

		const updatePgDetails = await axiosInstance.post(
			"/pg_controller/updateContactPersonDetails",
			new URLSearchParams({
				pg_id: sessionStorage.getItem("pg_id"),
				contact_person_name: contact_person_name,
				contact_person_phone_number: contact_person_phone_number,
			}),
			{
				headers: {
					Authorization: "Bearer " + sessionStorage.getItem("token"),
				},
			}
		);

		if (updatePgDetails.data) {
			sessionStorage.removeItem("allPgDetails");
			sessionStorage.removeItem("pgDetails");
			sessionStorage.removeItem("foodMenu");
			sessionStorage.removeItem("pg_id");
			sessionStorage.removeItem("allPrices");
			sessionStorage.removeItem("contactPersonDetails");
			sessionStorage.removeItem("roomDetails");
			sessionStorage.removeItem("roomSharingType");
			sessionStorage.removeItem("roomImages");
			sessionStorage.removeItem("pgImageIds");
			sessionStorage.removeItem("pg_id");
			sessionStorage.removeItem("pgImageUrl");
			setPropertyPosted(true);
		}
	};

	const goBack = () => {
		const contactPersonDetails = {
			contact_person_name,
			contact_person_phone_number,
		};

		sessionStorage.setItem(
			"contactPersonDetails",
			JSON.stringify(contactPersonDetails)
		);
		navigate("/FoodMenuDetails");
	};

	return (
		<div className="contact">
			<div className="header">
				<Header />
			</div>
			<div className="container" style={{ maxWidth: 1376 }}>
				<div
					className="d-flex flex-row"
					style={{ marginTop: 72, marginBottom: 348, gap: 24 }}
				>
					<Legend currentPage={7} />
					<div className="contactDetailsPage">
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

						<div className="contactDetails">
							<h2 className="detailHeading">Contact Details</h2>
							<p className="detail">
								Help property seekers to find you accurately
							</p>
						</div>

						<Form>
							<Form.Group controlId="formContactDetails">
								<Form.Group className="pricing-form-group">
									{errorMessageName && (
										<div className="text-danger">
											{errorMessageName}
										</div>
									)}
									<Form.Label className="pricing-form-label">
										Contact Person Name
									</Form.Label>
									<Form.Control
										type="text"
										value={contact_person_name}
										onChange={(e) =>
											setName(e.target.value)
										}
										className="pricing-form-control"
									/>
								</Form.Group>

								{errorMessagePhone && (
									<div className="text-danger">
										{errorMessagePhone}
									</div>
								)}
								<Form.Group className="pricing-form-group">
									<Form.Label className="pricing-form-label">
										Phone Number
									</Form.Label>
									<Form.Control
										type="text"
										placeholder="Enter your phone number"
										value={contact_person_phone_number}
										onChange={(e) => {
											const value = e.target.value;
											const cleanedValue = value
												.replace(/\D/g, "")
												.slice(0, 10);
											setPhoneNumber(cleanedValue);
											validate(
												"phoneNumber",
												cleanedValue,
												setErrorMessagePhone
											);
										}}
										className="pricing-form-control"
										style={{ width: 276 }}
									/>
								</Form.Group>
							</Form.Group>
							<Button
								variant="primary"
								className="postPropertyBtn"
								onClick={handleSubmit}
							>
								Post Property
							</Button>
						</Form>
					</div>
					<PropertyPostedPopup
						show={propertyPosted}
						onHide={() => setPropertyPosted(false)}
					/>
				</div>
			</div>
		</div>
	);
}
