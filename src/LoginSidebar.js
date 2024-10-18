import React, { useEffect, useState } from "react";
import { Offcanvas } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Styles/LoginSidebar.css";
import LoginIcon from "./images/LoginIcon.png";
import RegisterPopup from "./AccountCreation/RegisterPopup";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "./AxiosInstance";
import LoginPopup from "./AccountCreation/LoginPopup";

export default function LoginSidebar({ show, onHide }) {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [loginIconSrc, setLoginIconSrc] = useState(LoginIcon);
	const [userData, setUserData] = useState([]);
	const [registerPopup, setRegisterPopup] = useState(false);
	const [loginPopup, setLoginPopup] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		const loginStatus = sessionStorage.getItem("isLoggedIn");
		if (loginStatus) {
			setIsLoggedIn(true);
			const getData = async () => {
				try {
					const response = await axiosInstance.post(
						"/user_controller/getByUserId",
						new URLSearchParams({
							user_id: sessionStorage.getItem("user_id"),
						}),
						{
							headers: {
								Authorization:
									"Bearer " + sessionStorage.getItem("token"),
							},
						}
					);
					return response.data;
				} catch (error) {
					console.error("Error fetching user data:", error);
					throw error;
				}
			};

			getData().then((data) => setUserData(data));
		}
	}, []);

	useEffect(() => {
		const fetchProfileImage = async () => {
			try {
				setLoginIconSrc(
					userData.imageURL.includes("googleuser")
						? userData.imageURL
						: "http://localhost:8080/user_controller/" +
								userData.imageURL
				);
			} catch (error) {
				console.error("Error fetching profile image:", error);
				return;
			}
		};

		if (isLoggedIn) {
			fetchProfileImage();
		} else {
			setLoginIconSrc(LoginIcon);
		}
	}, [isLoggedIn, userData]);

	const postProperty = () => {
		onHide();
		navigate("/PostProperty", { state: { type: "new" } });
	};

	const showProperty = () => {
		onHide();
		navigate("/FetchAllPgByOwner", { state: { type: "new" } });
	};

	const handleLoginPopup = () => {
		setLoginPopup(true);
		setRegisterPopup(false);
	};

	const handleRegisterPopup = () => {
		setRegisterPopup(true);
		setLoginPopup(false);
	};

	const logout = () => {
		sessionStorage.clear();
		setIsLoggedIn(false);
		navigate("/");
	};

	const handleProfileClick = () => {
		navigate("/ProfileView", {
			state: { mode: "Edit", user_id: userData.id },
		});
	};

	return (
		<>
			<Offcanvas
				show={show}
				onHide={onHide}
				scroll
				backdrop
				placement="end"
			>
				<Offcanvas.Header closeButton />
				<Offcanvas.Body>
					<div className="loginSidebar">
						<div
							className="d-flex flex-row align-items-center"
							style={{ gap: 12 }}
						>
							<img
								src={loginIconSrc}
								className="loginIcon"
								alt="Login Icon"
								style={{ cursor: "pointer" }}
								onClick={
									isLoggedIn
										? handleProfileClick
										: handleLoginPopup
								}
							/>

							{isLoggedIn ? (
								<div className="login-register">
									<p className="hi">Hi There! </p>
									<span className="username">
										{userData.name}
									</span>
								</div>
							) : (
								<div className="login-register">
									<p className="hi">Hi There!</p>
									<div className="d-flex flex-row">
										<h2
											id="loginButton"
											className="loginButton"
											onClick={handleLoginPopup}
										>
											Login
										</h2>
										<h2
											className="loginButton"
											onClick={handleLoginPopup}
										>
											/
										</h2>
										<h2
											id="loginButton"
											className="loginButton"
											onClick={handleRegisterPopup}
										>
											Register
										</h2>
									</div>
								</div>
							)}
						</div>
					</div>
					{isLoggedIn ? (
						<>
							{userData.role === "Property Owner" ? (
								<div>
									<button
										className="postProperty"
										onClick={postProperty}
									>
										Post your property
									</button>
									<button
										className="postProperty"
										style={{ marginTop: 8 }}
										onClick={showProperty}
									>
										Show my properties
									</button>
								</div>
							) : (
								""
							)}
							<button className="logout" onClick={logout}>
								<div className="d-flex flex-row align-items-center gap-2">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
									>
										<path
											d="M5 11H13V13H5V16L0 12L5 8V11ZM3.99927 18H6.70835C8.11862 19.2447 9.97111 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C9.97111 4 8.11862 4.75527 6.70835 6H3.99927C5.82368 3.57111 8.72836 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C8.72836 22 5.82368 20.4289 3.99927 18Z"
											fill="#42526D"
										/>
									</svg>
									Logout
								</div>
							</button>
						</>
					) : (
						""
					)}
				</Offcanvas.Body>
			</Offcanvas>

			<RegisterPopup
				show={registerPopup}
				onHide={() => setRegisterPopup(false)}
				onContinue={handleLoginPopup}
			/>

			<LoginPopup
				show={loginPopup}
				onHide={() => setLoginPopup(false)}
				onBackToRegister={handleRegisterPopup}
			/>
		</>
	);
}
