import React, { useEffect, useRef, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../Styles/LoginPopup.css";
import { axiosInstance } from "../AxiosInstance";
import AccountLoggedIn from "./AccountLoggedIn";
import { validate } from "../GlobalFunctions";
import ForgotPassword from "./ForgotPassword.js";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../Firebase";
import SignInwithGoogle from "./SignInwithGoogle.js";
import ReCAPTCHA from "react-google-recaptcha";

function LoginPopup({ show, onHide, onBackToRegister }) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [passwordError, setPasswordError] = useState("");
	const [type, setType] = useState("password");
	const [loggedIn, setLoggedIn] = useState(false);
	const [forgotPassword, setForgotPassword] = useState(false);

	const inputRef = useRef(null);
	const recaptcha = useRef(null);

	useEffect(() => {
		const handleKeyPress = (event) => {
			if (event.key === "Enter") {
				event.preventDefault();
				document.getElementById("continueLogin").click();
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

	const handleContinue = async (emailProp, passwordProp, googleLogin) => {
		if (!recaptcha.current.getValue()) {
			alert("Verify You're Not a Robot!");
			return;
		}
		if (googleLogin) {
			setEmail(emailProp);
			setPassword(passwordProp);
		} else {
			const emailError = validate("email", email, setErrorMessage);

			const errorPassword = validate(
				"password",
				password,
				setErrorMessage
			);

			if (!emailError || !errorPassword) {
				return;
			}
		}

		try {
			await loginUser(emailProp, passwordProp, googleLogin);
		} catch (error) {
			console.error("Error during login:", error);
			setErrorMessage("Failed to sign in. Please try again.");
		}
	};

	const loginUser = async (emailProp, passwordProp, googleLogin) => {
		try {
			const loginResponse = await axiosInstance.post(
				"/auth/login",
				new URLSearchParams({
					email: emailProp ? emailProp : email,
					password: emailProp ? passwordProp : password,
					googleLogin: googleLogin,
				})
			);

			sessionStorage.setItem("token", loginResponse.data.token);

			let user = await getUser(emailProp ? emailProp : email);
			if (user.data.name !== null) {
				sessionStorage.setItem("user_id", user.data.id);
				sessionStorage.setItem("isLoggedIn", true);
				onHide();
				setLoggedIn(true);
			}

			setEmail("");
		} catch (error) {
			console.error("Login failed:", error);
			return;
		}
	};

	const getUser = async (email) => {
		try {
			const response = await axiosInstance.post(
				"/user_controller/getByEmail",
				new URLSearchParams({ email: email }),
				{
					headers: {
						Authorization:
							"Bearer " + sessionStorage.getItem("token"),
					},
				}
			);
			return response;
		} catch (error) {
			console.error("Error in POST method: ", error);
			return;
		}
	};

	const handleToggle = () => {
		if (type === "password") {
			setType("text");
		} else {
			setType("password");
		}
	};

	const handleRegister = () => {
		onHide();
		onBackToRegister();
	};

	const handleForgotPassword = () => {
		onHide();
		setForgotPassword(true);
	};

	const getMarginTop = () => {
		if (passwordError.length > 0) {
			return 120;
		} else {
			return 48;
		}
	};

	const handleGoogle = async (e) => {
		if (!recaptcha.current.getValue()) {
			alert("Verify You're Not a Robot!");
			return;
		}
		try {
			const provider = new GoogleAuthProvider();
			const result = await signInWithPopup(auth, provider);

			const user = result.user;

			handleContinue(user.email, "", true);
			onHide();
		} catch (error) {
			console.error("Google sign-in error:", error);
			setErrorMessage("Failed to sign in with Google. Please try again.");
		}
	};

	return (
		<>
			<Modal
				show={show}
				onHide={onHide}
				centered
				className="custom-register-modal"
				backdrop="static"
			>
				<Modal.Header className="custom-register-modal-header">
					<Modal.Title>Login</Modal.Title>
				</Modal.Header>
				<div
					className="d-flex flex-column align-items-start gap-4"
					style={{ margin: "8px 24px" }}
				>
					<div className="d-flex flex-column">
						{errorMessage && (
							<div className="text-danger">{errorMessage}</div>
						)}
						<Form.Label className="enterNumber" id="enterNumber">
							Enter Email
						</Form.Label>
						<div className="d-flex flex-row gap-2">
							<Form.Control
								type="email"
								placeholder="Enter your email"
								value={email}
								onChange={(e) => {
									const value = e.target.value;
									setEmail(value);
									validate("email", value, setErrorMessage);
								}}
								className="email"
								ref={inputRef}
							/>
						</div>
					</div>
					<div className="d-flex flex-column">
						{passwordError && (
							<div className="text-danger">{passwordError}</div>
						)}
						<Form.Label className="enterNumber" id="enterNumber">
							Enter Password
						</Form.Label>
						<Form.Control
							type={type}
							placeholder="Enter password"
							value={password}
							onChange={(e) => {
								setPassword(e.target.value);
								validate(
									"password",
									e.target.value,
									setPasswordError
								);
							}}
							className="email"
							ref={inputRef}
						/>
						{type === "text" ? (
							<svg
								style={{ marginTop: getMarginTop() }}
								className="eye_icon_login"
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								onClick={handleToggle}
							>
								<path
									d="M12.0003 3C17.3924 3 21.8784 6.87976 22.8189 12C21.8784 17.1202 17.3924 21 12.0003 21C6.60812 21 2.12215 17.1202 1.18164 12C2.12215 6.87976 6.60812 3 12.0003 3ZM12.0003 19C16.2359 19 19.8603 16.052 20.7777 12C19.8603 7.94803 16.2359 5 12.0003 5C7.7646 5 4.14022 7.94803 3.22278 12C4.14022 16.052 7.7646 19 12.0003 19ZM12.0003 16.5C9.51498 16.5 7.50026 14.4853 7.50026 12C7.50026 9.51472 9.51498 7.5 12.0003 7.5C14.4855 7.5 16.5003 9.51472 16.5003 12C16.5003 14.4853 14.4855 16.5 12.0003 16.5ZM12.0003 14.5C13.381 14.5 14.5003 13.3807 14.5003 12C14.5003 10.6193 13.381 9.5 12.0003 9.5C10.6196 9.5 9.50026 10.6193 9.50026 12C9.50026 13.3807 10.6196 14.5 12.0003 14.5Z"
									fill="#535260"
								/>
							</svg>
						) : (
							<svg
								style={{ marginTop: getMarginTop() }}
								className="eye_icon_login"
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								onClick={handleToggle}
							>
								<path
									d="M17.8827 19.2968C16.1814 20.3755 14.1638 21.0002 12.0003 21.0002C6.60812 21.0002 2.12215 17.1204 1.18164 12.0002C1.61832 9.62283 2.81932 7.5129 4.52047 5.93457L1.39366 2.80777L2.80788 1.39355L22.6069 21.1925L21.1927 22.6068L17.8827 19.2968ZM5.9356 7.3497C4.60673 8.56015 3.6378 10.1672 3.22278 12.0002C4.14022 16.0521 7.7646 19.0002 12.0003 19.0002C13.5997 19.0002 15.112 18.5798 16.4243 17.8384L14.396 15.8101C13.7023 16.2472 12.8808 16.5002 12.0003 16.5002C9.51498 16.5002 7.50026 14.4854 7.50026 12.0002C7.50026 11.1196 7.75317 10.2981 8.19031 9.60442L5.9356 7.3497ZM12.9139 14.328L9.67246 11.0866C9.5613 11.3696 9.50026 11.6777 9.50026 12.0002C9.50026 13.3809 10.6196 14.5002 12.0003 14.5002C12.3227 14.5002 12.6309 14.4391 12.9139 14.328ZM20.8068 16.5925L19.376 15.1617C20.0319 14.2268 20.5154 13.1586 20.7777 12.0002C19.8603 7.94818 16.2359 5.00016 12.0003 5.00016C11.1544 5.00016 10.3329 5.11773 9.55249 5.33818L7.97446 3.76015C9.22127 3.26959 10.5793 3.00016 12.0003 3.00016C17.3924 3.00016 21.8784 6.87993 22.8189 12.0002C22.5067 13.6998 21.8038 15.2628 20.8068 16.5925ZM11.7229 7.50857C11.8146 7.503 11.9071 7.50016 12.0003 7.50016C14.4855 7.50016 16.5003 9.51488 16.5003 12.0002C16.5003 12.0933 16.4974 12.1858 16.4919 12.2775L11.7229 7.50857Z"
									fill="#535260"
								/>
							</svg>
						)}

						<div
							className="d-flex flex-row align-items-center gap-2"
							style={{ marginTop: 10 }}
						>
							<p
								className="signIn"
								style={{
									width: 147,
									color: "#000000",
								}}
							>
								Don't have an account?
							</p>
							<Button
								className="signIn"
								onClick={handleRegister}
								style={{ padding: 0 }}
							>
								Sign up
							</Button>
							<Button
								className="signIn"
								onClick={handleForgotPassword}
								style={{ padding: 0 }}
							>
								Forgot Password?
							</Button>
						</div>
					</div>
					<Button
						variant="primary"
						onClick={() => handleContinue("", "", false)}
						className="continueLogin"
						id="continueLogin"
					>
						Continue
					</Button>

					<div id="captcha" align="left">
						<ReCAPTCHA
							sitekey={process.env.REACT_APP_SITE_KEY}
							ref={recaptcha}
						/>
					</div>

					<SignInwithGoogle onClick={(e) => handleGoogle(e)} />
				</div>
			</Modal>

			<AccountLoggedIn
				show={loggedIn}
				onHide={() => setLoggedIn(false)}
			/>

			<ForgotPassword
				show={forgotPassword}
				onHide={() => setForgotPassword(false)}
			/>
		</>
	);
}

export default LoginPopup;
