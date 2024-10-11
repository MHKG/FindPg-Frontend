import { Modal } from "react-bootstrap";
import GreenTick from "../images/GreenTick.png";
import "../Styles/PropertyPostedPopup.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PropertyPostedPopup({ show, onHide }) {
	const [count, setCount] = useState(5);
	const navigate = useNavigate();

	useEffect(() => {
		if (show) {
			const countdownInterval = setInterval(() => {
				setCount((prevCount) => {
					if (prevCount > 0) {
						return prevCount - 1;
					} else {
						clearInterval(countdownInterval);
						navigate("/");
						return prevCount;
					}
				});
			}, 1000);

			return () => {
				clearInterval(countdownInterval);
			};
		}
	}, [show, onHide]);
	return (
		<Modal show={show} onHide={onHide} centered backdrop="static">
			<div
				className="d-flex flex-column align-items-center gap-1"
				style={{ padding: "132px 97px" }}
			>
				<h2 className="postedText">Property posted Successfully</h2>
				<img src={GreenTick} className="tick" alt="Tick" />
				<p>You will be redirected to the home page in: {count}</p>
			</div>
		</Modal>
	);
}
