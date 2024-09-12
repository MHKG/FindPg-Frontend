import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import "../Styles/PostProperty.css";
import Header from "../Header";
import { useLocation, useNavigate } from "react-router-dom";
import Legend from "./Legend";
import { axiosInstance } from "../AxiosInstance";

export default function PostProperty() {
	const pgDetails = JSON.parse(sessionStorage.getItem("pgDetails"));
	const [pg_id, setPgId] = useState(
		JSON.parse(sessionStorage.getItem("pg_id"))
	);
	const [pg_name, setPgName] = useState(() => {
		return pgDetails ? pgDetails.pg_name : "";
	});
	const [location, setLocation] = useState(() => {
		return pgDetails ? pgDetails.location : "";
	});
	const [state, setState] = useState(() => {
		return pgDetails ? pgDetails.state : "";
	});
	const [city, setCity] = useState(() => {
		return pgDetails ? pgDetails.city : "";
	});
	const [stateOptions, setStateOptions] = useState([]);
	const [cityOptions, setCityOptions] = useState([]);
	const [errorMessageName, setErrorMessageName] = useState("");
	const [errorMessageLocation, setErrorMessageLocation] = useState("");
	const [errorMessageState, setErrorMessageState] = useState("");
	const [errorMessageCity, setErrorMessageCity] = useState("");
	const navigate = useNavigate();
	const locationState = useLocation();
	const customOption = {
		value: "",
		label: "-- select an option --",
	};

	useEffect(() => {
		if (locationState.state.type === "new") {
			setPgId(null);
		}
	}, [locationState]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await axiosInstance.get(
					"/city_state_controller/getAll"
				);
				if (response.data) {
					const states = Array.from(
						new Set(response.data.map((item) => item[2]))
					)
						.map((states) => ({ value: states, label: states }))
						.sort((a, b) => a.label.localeCompare(b.label));

					const stateOptions = [customOption, ...states];
					setStateOptions(stateOptions);
				}
			} catch (error) {
				console.error("Error fetching cities and states:", error);
				return;
			}
		};
		fetchData();
	}, []);

	useEffect(() => {
		if (state) {
			const fetchCities = async () => {
				try {
					const response = await axiosInstance.get(
						"/city_state_controller/getAll"
					);
					if (response.data) {
						const cities = response.data
							.filter((item) => item[2] === state)
							.map((item) => ({
								value: item[1],
								label: item[1],
							}))
							.sort((a, b) => a.label.localeCompare(b.label));

						const cityOptions = [customOption, ...cities];
						setCityOptions(cityOptions);
					}
				} catch (error) {
					console.error("Error fetching cities:", error);
					return;
				}
			};
			fetchCities();
		}
	}, [state]);

	const handleSubmit = async () => {
		if (pg_name.length === 0) {
			setErrorMessageName("Name cannot be empty.");
			return;
		} else {
			setErrorMessageName("");
		}

		if (location.length === 0) {
			setErrorMessageLocation("Location cannot be empty.");
			return;
		} else {
			setErrorMessageLocation("");
		}

		if (state.length === 0) {
			setErrorMessageState("State cannot be empty.");
			return;
		} else {
			setErrorMessageState("");
		}

		if (city.length === 0) {
			setErrorMessageCity("City cannot be empty.");
			return;
		} else {
			setErrorMessageCity("");
		}

		const userResponse = await axiosInstance.post(
			"/user_controller/getByUserId",
			new URLSearchParams({
				user_id: sessionStorage.getItem("user_id"),
			}),
			{
				headers: {
					Authorization: "Bearer " + sessionStorage.getItem("token"),
				},
			}
		);

		let pgResponse;

		if (pg_id) {
			pgResponse = await axiosInstance.post(
				"/pg_controller/update",
				{
					pg_id: pg_id,
					pg_name: pg_name,
					location: location,
					city: city,
					state: state,
				},
				{
					headers: {
						Authorization:
							"Bearer " + sessionStorage.getItem("token"),
						"Content-Type": "application/json",
					},
				}
			);
		} else {
			pgResponse = await axiosInstance.post(
				"/pg_controller/add",
				{
					owner_id: userResponse.data.id,
					pg_name: pg_name,
					location: location,
					city: city,
					state: state,
				},
				{
					headers: {
						Authorization:
							"Bearer " + sessionStorage.getItem("token"),
						"Content-Type": "application/json",
					},
				}
			);
		}

		if (pgResponse.data.success) {
			sessionStorage.setItem("pg_id", pgResponse.data.successmsg);

			const pgDetails = {
				pg_name: pg_name,
				location: location,
				state: state,
				city: city,
			};
			sessionStorage.setItem("pgDetails", JSON.stringify(pgDetails));

			navigate("/PgDetails");
		}
	};

	return (
		<div className="postPropertyPage">
			<div className="header">
				<Header />
			</div>
			<div className="container" style={{ maxWidth: 1376 }}>
				<div
					className="d-flex flex-row"
					style={{ marginTop: 72, marginBottom: 348, gap: 24 }}
				>
					<Legend currentPage={1} />
					<div className="pgLocation" style={{ padding: 40 }}>
						<div className="heading">
							<h2 className="yourPg">Your Pg Location</h2>
							<p className="help">
								Help property seekers to find you accurately
							</p>
						</div>
						<Form>
							<div className="d-flex flex-column gap-3">
								{errorMessageName && (
									<p className="text-danger">
										{errorMessageName}
									</p>
								)}
								<Form.Group className="post-property-form-group">
									<Form.Label className="post-property-form-label">
										Pg Name
									</Form.Label>
									<Form.Control
										type="text"
										placeholder="Enter Pg Name"
										value={pg_name}
										onChange={(e) =>
											setPgName(e.target.value)
										}
										className="post-property-form-control"
									/>
								</Form.Group>
								{errorMessageLocation && (
									<p className="text-danger">
										{errorMessageLocation}
									</p>
								)}
								<Form.Group className="post-property-form-group">
									<Form.Label className="post-property-form-label">
										Address
									</Form.Label>
									<Form.Control
										type="text"
										placeholder="Enter Pg Location"
										value={location}
										onChange={(e) =>
											setLocation(e.target.value)
										}
										className="post-property-form-control"
									/>
								</Form.Group>
								{errorMessageState && (
									<p className="text-danger">
										{errorMessageState}
									</p>
								)}
								<Form.Group className="post-property-form-group">
									<Form.Label className="post-property-form-label">
										State
									</Form.Label>
									<Form.Select
										value={state}
										onChange={(e) =>
											setState(e.target.value)
										}
										className="post-property-form-select"
									>
										{stateOptions.map((states, index) => (
											<option
												key={index}
												value={states.value}
												disabled={index === 0}
											>
												{states.label}
											</option>
										))}
									</Form.Select>
								</Form.Group>
								{errorMessageCity && (
									<p className="text-danger">
										{errorMessageCity}
									</p>
								)}
								<Form.Group className="post-property-form-group">
									<Form.Label className="post-property-form-label">
										City
									</Form.Label>
									<Form.Select
										value={city}
										onChange={(e) =>
											setCity(e.target.value)
										}
										className="post-property-form-select"
									>
										{cityOptions.map((cities, index) => (
											<option
												key={index}
												value={cities.value}
												disabled={index === 0}
											>
												{cities.label}
											</option>
										))}
									</Form.Select>
								</Form.Group>
							</div>
							<Button
								variant="primary"
								className="w-100 button"
								onClick={handleSubmit}
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
