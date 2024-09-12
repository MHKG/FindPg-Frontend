import React, { useEffect, useRef, useState } from "react";
import { Modal, Button, Form, Dropdown } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../Styles/CreateAccount.css";
import AccountCreated from "./AccountCreated";
import uploadImage from "../images/uploadImage.png";
import { axiosInstance } from "../AxiosInstance";

export default function CreateAccount({ show, onHide, params }) {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [phoneNumber, setPhoneNumber] = useState("");
	const [address, setAddress] = useState("");
	const [languages, setLanguages] = useState("");
	const [accountCreated, setAccountCreated] = useState(false);
	const [imageSrc, setImageSrc] = useState(uploadImage);
	const fileInputRef = useRef(null);
	const [errorMessage, setErrorMessage] = useState("");
	const [selectedFile, setSelectedFile] = useState(null);
	const [role, setRole] = useState("-- select an option --");
	const inputRef = useRef(null);

	useEffect(() => {
		const handleKeyPress = (event) => {
			if (event.key === "Enter") {
				event.preventDefault();
				document.getElementById("createAccount").click();
			}
		};

		const input = inputRef.current;
		if (show && input) {
			input.addEventListener("keypress", handleKeyPress);
		}

		return () => {
			if (show && input) {
				input.removeEventListener("keypress", handleKeyPress);
			}
		};
	}, [show]);

	useEffect(() => {
		setName(params?.displayName);
		setEmail(params?.email);
		setPhoneNumber(params?.phoneNumber);
		setImageSrc(params?.photoURL);
		setSelectedFile(params?.photoURL);
	}, [params]);

	const submit = async () => {
		if (!selectedFile) {
			alert("Select an image to continue.");
			return;
		}

		const formData = new FormData();
		formData.append("image", selectedFile);
		formData.append("user_id", sessionStorage.getItem("user_id"));

		try {
			if (!imageSrc.includes("googleuser")) {
				const imageResponse = await axiosInstance.post(
					"/user_controller/uploadImage",
					formData,
					{
						headers: {
							"Content-Type": "multipart/form-data",
						},
					}
				);
			}

			const userResponse = await axiosInstance.post(
				"/user_controller/updateUserDetails",
				{
					name,
					email,
					phone_number: phoneNumber,
					imageURL: imageSrc,
					address,
					languages,
					role: role,
				}
			);

			if (userResponse.data.success) {
				onHide();
				setAccountCreated(true);
			} else {
				alert(userResponse.data.errmsg);
			}
		} catch (error) {
			console.error("Error:", error);
			setErrorMessage("Failed to create account. Please try again.");
		}
	};

	const handleImageClick = () => {
		fileInputRef.current.click();
	};

	const changeImg = (e) => {
		const file = e.target.files[0];
		if (file) {
			if (file.type.startsWith("image/")) {
				const imageUrl = URL.createObjectURL(file);
				setImageSrc(imageUrl);
				setSelectedFile(file);
				setErrorMessage("");
			} else {
				setErrorMessage("Please upload a valid image file.");
			}
		}
	};

	const handleRoleChange = (eventKey) => {
		setRole(eventKey);
	};

	return (
		<>
			<Modal
				show={show}
				onHide={onHide}
				centered
				className="custom-modal"
				backdrop="static"
			>
				<Modal.Header className="custom-modal-header">
					<Modal.Title className="custom-modal-title">
						Create Your Account
					</Modal.Title>
				</Modal.Header>
				<div
					className="d-flex flex-column gap-4"
					style={{ margin: "8px 48px" }}
				>
					{errorMessage && (
						<p className="text-danger">{errorMessage}</p>
					)}
					<div className="d-flex flex-row align-items-center gap-3">
						<img
							src={imageSrc}
							className="uploadImage col-4"
							alt="uploadImage"
							onClick={handleImageClick}
						/>
						<p className="uploadImgText col-8">
							Upload an image or a logo
						</p>
					</div>
					<input
						type="file"
						accept="image/*"
						onChange={changeImg}
						ref={fileInputRef}
						style={{ display: "none" }}
					/>
					<Form.Group
						controlId="formCustomInput"
						className="inputGroup"
					>
						<Form.Label className="label">Name</Form.Label>
						<Form.Control
							type="text"
							placeholder=""
							className="input"
							value={name}
							onChange={(e) => setName(e.target.value)}
							ref={inputRef}
						/>
					</Form.Group>
					<div className="d-flex flex-column gap-2">
						<Form.Group
							controlId="formCustomInput"
							className="inputGroup"
						>
							<Form.Label className="label">Email</Form.Label>
							<Form.Control
								type="email"
								placeholder=""
								className="input"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								ref={inputRef}
							/>
						</Form.Group>{" "}
					</div>
					<div className="d-flex flex-column gap-2">
						<Form.Group
							controlId="formCustomInput"
							className="inputGroup"
						>
							<Form.Label className="label">
								Phone Number
							</Form.Label>
							<Form.Control
								type="text"
								placeholder=""
								className="input"
								value={phoneNumber}
								onChange={(e) => setPhoneNumber(e.target.value)}
								style={{ paddingLeft: "130px" }}
								ref={inputRef}
							/>
						</Form.Group>
					</div>
					<Form.Group
						controlId="formCustomInput"
						className="inputGroup"
					>
						<Form.Label className="label">Address</Form.Label>
						<Form.Control
							type="text"
							placeholder=""
							className="input"
							value={address}
							onChange={(e) => setAddress(e.target.value)}
							style={{ paddingLeft: "80px" }}
							ref={inputRef}
						/>
					</Form.Group>
					<Form.Group
						controlId="formCustomInput"
						className="inputGroup"
					>
						<Form.Label className="label">Languages</Form.Label>
						<Form.Control
							type="text"
							placeholder="Enter languages separated by commas"
							className="input"
							value={languages}
							style={{ paddingLeft: "100px" }}
							onChange={(e) => setLanguages(e.target.value)}
							ref={inputRef}
						/>
					</Form.Group>
					<Dropdown onSelect={handleRoleChange}>
						<Dropdown.Toggle
							variant="outline-secondary"
							id="dropdown-basic"
							className="inputGroup"
						>
							<Form.Label className="label" for="formCustomInput">
								Select Role
							</Form.Label>
							<span
								className="cleaningOption"
								id="formCustomInput"
								style={{ position: "static" }}
							>
								{role}
							</span>
						</Dropdown.Toggle>
						<Dropdown.Menu style={{ width: "100%" }}>
							<Dropdown.Item
								disabled
								key="select option"
								eventKey="Select Option"
							>
								-- select an option --
							</Dropdown.Item>
							<Dropdown.Item
								key="Property Owner"
								eventKey="Property Owner"
							>
								Property Owner
							</Dropdown.Item>
							<Dropdown.Item key="Tenant" eventKey="Tenant">
								Tenant
							</Dropdown.Item>
						</Dropdown.Menu>
					</Dropdown>
					<Button
						variant="primary"
						className="createAccount"
						onClick={submit}
						id="createAccount"
					>
						Create Account
					</Button>
				</div>
			</Modal>

			<AccountCreated
				show={accountCreated}
				onHide={() => setAccountCreated(false)}
			/>
		</>
	);
}
