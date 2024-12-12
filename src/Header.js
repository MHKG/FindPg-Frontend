import React, { useState } from "react";
import LogoPeace from "./images/LOGO Peace.png";
import UserIcon from "./images/User Icon.png";
import HambungIcon from "./images/Hambung Icon.png";
import "./Styles/Header.css";
import LoginSidebar from "./LoginSidebar";
import RegisterPopup from "./AccountCreation/RegisterPopup";
import LoginPopup from "./AccountCreation/LoginPopup";
import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";

export default function Header({ params }) {
	const [sidebar, setSidebar] = useState(false);
	const [registerPopup, setRegisterPopup] = useState(false);
	const [loginPopup, setLoginPopup] = useState(false);
	const navigate = useNavigate();

	const loginSidebar = () => {
		setSidebar(true);
	};

	const handleLoginPopup = () => {
		setLoginPopup(true);
		setRegisterPopup(false);
	};

	const handleRegisterPopup = () => {
		setRegisterPopup(true);
		setLoginPopup(false);
	};

	return (
		<div className="d-flex flex-row justify-content-between">
			<img
				alt="Peace Logo"
				src={LogoPeace}
				className="peaceIcon"
				onClick={() => navigate("/")}
			/>
			<div
				style={{
					marginTop: 12,
					display: `${params ? params : "none"}`,
				}}
			>
				<SearchBar />
			</div>

			<div className="login">
				<img
					src={UserIcon}
					className="icons"
					alt="User Icon"
					onClick={handleLoginPopup}
				/>
				<img
					src={HambungIcon}
					className="icons"
					alt="Hambung Icon"
					onClick={loginSidebar}
				/>
			</div>

			<LoginSidebar show={sidebar} onHide={() => setSidebar(false)} />

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
		</div>
	);
}
