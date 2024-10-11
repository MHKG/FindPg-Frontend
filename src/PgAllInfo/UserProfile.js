import { useEffect, useState } from "react";
import "../Styles/UserProfile.css";
import React, { Button } from "react-bootstrap";
import Calendar from "../images/Calendar.png";
import Phone from "../images/Phone.png";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../AxiosInstance";

export default function UserProfile({ ownerId, mode }) {
	const [userDetails, setUserDetails] = useState([]);
	const [imageURL, setImageURL] = useState([]);
	const [loading, setLoading] = useState(true);

	const navigate = useNavigate();

	const owner_id = ownerId;

	useEffect(() => {
		const fetchUserDetails = async () => {
			const response = await axiosInstance.post(
				"/user_controller/getByUserId",
				new URLSearchParams({ user_id: owner_id }),
				{
					headers: {
						Authorization:
							"Bearer " + sessionStorage.getItem("token"),
					},
				}
			);
			setUserDetails(response.data);
			setLoading(false);
		};

		fetchUserDetails();
	}, [owner_id]);

	useEffect(() => {
		setImageURL(
			userDetails.imageURL?.includes("googleuser")
				? userDetails.imageURL
				: "http://localhost:8080/user_controller/" +
						userDetails.imageURL
		);
	}, [userDetails]);

	const handleProfileClick = () => {
		navigate("/ProfileView", { state: { mode: mode, user_id: ownerId } });
	};

	if (loading || !userDetails.imageURL) {
		return <div>Loading...</div>;
	}

	return (
		<div className="ownerDetails">
			<div
				className="d-flex flex-row align-items-center"
				style={{ gap: 13 }}
			>
				<img
					src={imageURL}
					className="userImage"
					alt="Profile Picture"
					onClick={handleProfileClick}
					style={{ cursor: "pointer" }}
				/>
				<div className="ownerDetail">
					<p className="designation">Property Owner</p>
					<h2 className="userName">{userDetails.name}</h2>
				</div>
			</div>

			<div className="userAddress" style={{ marginTop: 20 }}>
				<p className="titleDetails">Native</p>
				<h2 className="address">{userDetails.address}</h2>
			</div>

			<div className="userAddress" style={{ marginTop: 24 }}>
				<p className="titleDetails">Language Known</p>
				<h2 className="address">{userDetails.languages}</h2>
			</div>
			<div
				className="d-flex flexf-row align-items-center"
				style={{ marginTop: 24, gap: 12 }}
			>
				<Button className="visitUserBtn">
					<div className="visitUserBtnDiv">
						<img
							src={Calendar}
							className="calendar"
							alt="Calendar"
						/>
						<span className="scheduleUserVisitText">
							Schedule Visit
						</span>
					</div>
				</Button>
				<Button className="contactUserBtn">
					<div className="contactUserBtnDiv">
						<img src={Phone} className="phone" alt="Phone" />
						<span className="contactUserText">Contact</span>
					</div>
				</Button>
			</div>
		</div>
	);
}
