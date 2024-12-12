import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../Styles/AccountCreated.css";
import GreenTick from "../images/GreenTick.png";

export default function AccountCreated({ show, onHide }) {
	const [count, setCount] = useState(5);

	useEffect(() => {
		if (!show) return;

		const countdownInterval = setInterval(() => {
			setCount((prevCount) => {
				if (prevCount > 1) {
					return prevCount - 1;
				} else {
					clearInterval(countdownInterval);
					window.location.reload();
					return prevCount;
				}
			});
		}, 1000);

		return () => clearInterval(countdownInterval);
	}, [show, onHide]);

	return (
		<Modal show={show} onHide={onHide} centered backdrop="static">
			<div
				className="d-flex flex-column align-items-center gap-1"
				style={{ padding: "132px 97px" }}
			>
				<h2 className="accountCreatedText">
					Account Created Successfully, login to continue
				</h2>
				<img src={GreenTick} className="GreenTick" alt="tick" />
				<p>You will be redirected to the home page in: {count}</p>
			</div>
		</Modal>
	);
}
