import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { axiosInstance } from "../AxiosInstance";

export default function ForgotPassword({ show, onHide }) {
	const [email, setEmail] = useState("");

	const handleContinue = async () => {
		const response = await axiosInstance.post(
			"/email_controller/sendEmail",
			new URLSearchParams({ email: email })
		);

		if (response.status === 200) {
			alert("Reset link has been sent to your email");
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
					<Modal.Title>Forgot Password</Modal.Title>
				</Modal.Header>
				<div
					className="d-flex flex-column align-items-start gap-4"
					style={{ margin: "8px 24px" }}
				>
					<div className="d-flex flex-column">
						<Form.Label className="enterNumber" id="enterNumber">
							Enter Email
						</Form.Label>
						<Form.Control
							type="email"
							placeholder="Enter your email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="email"
						/>
					</div>
					<Button
						variant="primary"
						onClick={handleContinue}
						className="continueLogin"
						id="continueLogin"
						style={{ marginBottom: 28 }}
					>
						Send Reset Link
					</Button>
				</div>
			</Modal>
		</>
	);
}
