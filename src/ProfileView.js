import { useEffect, useRef, useState } from "react";
import "./Styles/ProfileView.css";
import Header from "./Header";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { axiosInstance } from "./AxiosInstance";

export default function ProfileView() {
	const [userData, setUserData] = useState({});
	const [loading, setLoading] = useState(true);
	const [imageSrc, setImageSrc] = useState("");
	const [selectedFile, setSelectedFile] = useState(null);
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [phone_number, setPhoneNumber] = useState("");
	const [address, setAddress] = useState("");
	const [languages, setLanguages] = useState("");
	const fileInputRef = useRef(null);

	const location = useLocation();
	const mode = location.state.mode;

	const user_id = location.state.user_id;

	useEffect(() => {
		const fetchUserData = async () => {
			const response = await axiosInstance.post(
				"/user_controller/getByUserId",
				new URLSearchParams({
					user_id: user_id,
				}),
				{
					headers: {
						Authorization:
							"Bearer " + sessionStorage.getItem("token"),
					},
				}
			);
			const data = response.data;
			setUserData(data);
			setImageSrc(
				data.imageURL.includes("googleuser")
					? data.imageURL
					: "http://localhost:8080/user_controller/" + data.imageURL
			);
			setName(data.name);
			setEmail(data.email);
			setPhoneNumber(data.phone_number);
			setAddress(data.address);
			setLanguages(data.languages);
			setLoading(false);
		};

		fetchUserData();
	}, [user_id]);

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
			} else {
				alert("Please select a valid image file");
			}
		}
	};

	const updateProfile = async () => {
		const updatedUserData = {
			name,
			email,
			phone_number,
			address,
			languages,
			role: userData.role,
		};
		const formData = new FormData();
		formData.append("image", selectedFile);
		formData.append("user_id", sessionStorage.getItem("user_id"));

		try {
			if (selectedFile) {
				await axiosInstance.post(
					"/user_controller/uploadImage",
					formData,
					{
						headers: {
							Authorization:
								"Bearer " + sessionStorage.getItem("token"),
							"Content-Type": "multipart/form-data",
						},
					}
				);
			}

			await axiosInstance.post(
				"/user_controller/updateUserDetails",
				updatedUserData,
				{
					headers: {
						Authorization:
							"Bearer " + sessionStorage.getItem("token"),
					},
				}
			);
			alert("Profile updated successfully!");
		} catch (error) {
			console.error("Error updating profile: ", error);
			alert("Failed to update profile");
		}
	};

	if (loading) {
		return <div>Loading...</div>;
	}

	return (
		<div id="inv_bg">
			<div className="header">
				<Header />
			</div>
			<Container>
				<div
					className="d-flex flex-column align-items-center justify-content-center"
					style={{ paddingTop: "100px" }}
				>
					<Row
						className="d-flex flex-column align-items-center justify-content-center"
						style={{ gap: "25px", width: 500 }}
					>
						<Col
							className="d-flex flex-column align-items-center justify-content-center"
							style={{ gap: "25px" }}
						>
							<img
								src={imageSrc}
								alt="Profile"
								className="profile_image"
								onClick={
									mode === "Edit"
										? handleImageClick
										: () => {}
								}
								style={{
									cursor:
										mode === "Edit" ? "pointer" : "default",
								}}
							/>
							{mode === "Edit" && (
								<input
									type="file"
									accept="image/*"
									onChange={changeImg}
									ref={fileInputRef}
									style={{ display: "none" }}
								/>
							)}
						</Col>
						<Col
							className="d-flex flex-row align-items-center justify-content-center"
							style={{ gap: "25px" }}
						>
							<Form.Group>
								<Form.Label>Name</Form.Label>
								{mode === "Edit" ? (
									<Form.Control
										type="text"
										value={name}
										onChange={(e) =>
											setName(e.target.value)
										}
									/>
								) : (
									<h2>{userData.name}</h2>
								)}
							</Form.Group>
							<Form.Group>
								<Form.Label>Email</Form.Label>
								{mode === "Edit" ? (
									<Form.Control
										type="email"
										value={email}
										onChange={(e) =>
											setEmail(e.target.value)
										}
										readOnly={mode !== "Edit"}
									/>
								) : (
									<h2>{userData.email}</h2>
								)}
							</Form.Group>
						</Col>
						<Col
							className="d-flex flex-row align-items-center justify-content-center"
							style={{ gap: "25px" }}
						>
							<Form.Group>
								<Form.Label>Phone Number</Form.Label>
								{mode === "Edit" ? (
									<Form.Control
										type="number"
										value={phone_number}
										onChange={(e) =>
											setPhoneNumber(e.target.value)
										}
										readOnly={mode !== "Edit"}
									/>
								) : (
									<h2>{userData.phone_number}</h2>
								)}
							</Form.Group>
							<Form.Group>
								<Form.Label>Languages</Form.Label>
								{mode === "Edit" ? (
									<Form.Control
										type="text"
										value={languages}
										onChange={(e) =>
											setLanguages(e.target.value)
										}
										readOnly={mode !== "Edit"}
									/>
								) : (
									<h2>{userData.languages}</h2>
								)}
							</Form.Group>
						</Col>
						<Col
							className="d-flex flex-column align-items-center justify-content-center"
							style={{ gap: "25px" }}
						>
							<Form.Group style={{ width: "100%" }}>
								<Form.Label>Address</Form.Label>
								{mode === "Edit" ? (
									<Form.Control
										as="textarea"
										value={address}
										onChange={(e) =>
											setAddress(e.target.value)
										}
										readOnly={mode !== "Edit"}
										style={{ height: "150px" }}
									/>
								) : (
									<h2>{userData.address}</h2>
								)}
							</Form.Group>{" "}
						</Col>
						{mode === "Edit" && (
							<Col className="d-flex justify-content-center">
								<Button onClick={updateProfile}>
									Update Profile
								</Button>
							</Col>
						)}
					</Row>
				</div>
			</Container>
		</div>
	);
}
