import { Button, Form, FormControl } from "react-bootstrap";
import Find from "./images/Find.png";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import "./Styles/SearchBar.css";
import RegisterPopup from "./AccountCreation/RegisterPopup";
import { axiosInstance } from "./AxiosInstance";
import LoginPopup from "./AccountCreation/LoginPopup";

export default function SearchBar() {
	const [userSearchLocation, setUserSearchLocation] = useState("");
	const [allLocations, setAllLocations] = useState([]);
	const navigate = useNavigate();
	const [registerPopup, setRegisterPopup] = useState(false);
	const [loginPopup, setLoginPopup] = useState(false);
	const [optionShow, setOptionShow] = useState(false);
	const [optionPosition, setOptionPosition] = useState({ top: 0, left: 0 });
	const idRef = useRef(null);

	const handleClick = (e) => {
		searchLocation();
		const rect = e.target.getBoundingClientRect();
		setOptionPosition({
			top: rect.bottom + window.scrollY,
			left: rect.left + window.scrollX,
		});
		setUserSearchLocation(e.target.value);
		setOptionShow(true);
	};

	const handleClickOutside = (event) => {
		if (idRef.current && !idRef.current.contains(event.target)) {
			setOptionShow(false);
		}
	};

	useEffect(() => {
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const searchPg = () => {
		if (userSearchLocation.length === 0) {
			alert("Please enter a location to search.");
			return;
		} else if (!sessionStorage.getItem("isLoggedIn")) {
			setLoginPopup(true);
			return;
		} else {
			sessionStorage.setItem("userSearchLocation", userSearchLocation);
			navigate(`/ListOfPg/${userSearchLocation}`);
		}
	};

	const searchLocation = async () => {
		const response = await axiosInstance.post(
			"/pg_controller/getAllLocations",
			new URLSearchParams({ location: userSearchLocation })
		);
		if (response.data.length > 0) {
			setAllLocations(response.data);
		}
	};

	const handleOptionClick = (location) => {
		setUserSearchLocation(location);
		setOptionShow(false);
	};

	return (
		<>
			<Form id="form" className="form">
				<Form.Group>
					<div className="d-inline-flex align-items-center">
						<FormControl
							type="text"
							onClick={(e) => handleClick(e)}
							value={userSearchLocation}
							placeholder="Search Locality"
							className="searchBar"
							onChange={(e) =>
								setUserSearchLocation(e.target.value)
							}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									e.preventDefault();
									searchPg();
								}
							}}
						/>
						<img src={Find} className="find" alt="Locate Icon" />
						<Button
							variant="primary"
							className="searchBtn"
							onClick={searchPg}
							id="searchBtn"
						>
							<svg
								className="searchIcon"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M11 2C15.968 2 20 6.032 20 11C20 15.968 15.968 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2ZM11 18C14.8675 18 18 14.8675 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18ZM19.4853 18.0711L22.3137 20.8995L20.8995 22.3137L18.0711 19.4853L19.4853 18.0711Z"
									fill="white"
								/>
							</svg>
							<span className="searchText">Search</span>
						</Button>
					</div>
				</Form.Group>
				{optionShow && (
					<div
						className="options-dropdown ellipsisOption"
						ref={idRef}
						style={{
							top: optionPosition.top,
							left: optionPosition.left,
						}}
					>
						{allLocations.map((location, index) => (
							<div
								key={index}
								className="option"
								style={{
									textDecoration: "none",
									cursor: "pointer",
								}}
								onClick={() => handleOptionClick(location)}
							>
								{location}
							</div>
						))}
					</div>
				)}
			</Form>

			<RegisterPopup
				show={registerPopup}
				onHide={() => setRegisterPopup(false)}
				onContinue={() => {
					setLoginPopup(true);
					setRegisterPopup(false);
				}}
			/>

			<LoginPopup
				show={loginPopup}
				onHide={() => setLoginPopup(false)}
				onBackToRegister={() => {
					setRegisterPopup(true);
					setLoginPopup(false);
				}}
			/>
		</>
	);
}
