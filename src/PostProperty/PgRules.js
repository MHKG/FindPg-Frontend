import Smoking from "../images/Smoking.png";
import Drinking from "../images/Drinking.png";
import LoudMusic from "../images/LoudMusic.png";
import Party from "../images/Party.png";
import VisitorEntry from "../images/VisitorEntry.png";
import { Form } from "react-bootstrap";

export default function PgRules({ pgRules, setPgRules }) {
	const handleRulesChange = (value) => {
		setPgRules((prevRules) => ({
			...prevRules,
			[value]: prevRules[value] === "Allowed" ? "Not Allowed" : "Allowed",
		}));
	};

	return (
		<Form>
			<Form.Group controlId="formPgRules" style={{ marginTop: 40 }}>
				<Form.Label column sm="4" className="formLabel">
					Pg Rules
				</Form.Label>
				<div
					className="d-flex flex-column gap-2"
					style={{ marginTop: 20 }}
				>
					<div
						className="d-flex flex-row gap-2"
						style={{ gap: "8px" }}
					>
						<label className="mb-2 checkButtons">
							<div className="imageNameGroup">
								<img src={Smoking} alt="Smoking Icon" />
								<span className="name">Smoking</span>
							</div>
							<input
								type="checkbox"
								checked={pgRules.smoking === "Allowed"}
								onChange={() => handleRulesChange("smoking")}
								style={{ marginTop: 16, cursor: "pointer" }}
							/>
						</label>
						<label className="mb-2 checkButtons">
							<div className="imageNameGroup">
								<img src={Drinking} alt="Drinking Icon" />
								<span className="name">Drinking</span>
							</div>
							<input
								type="checkbox"
								checked={pgRules.drinking === "Allowed"}
								onChange={() => handleRulesChange("drinking")}
								style={{ marginTop: 16, cursor: "pointer" }}
							/>
						</label>
					</div>
					<div
						className="d-flex flex-row gap-2"
						style={{ gap: "8px" }}
					>
						<label className="mb-2 checkButtons">
							<div className="imageNameGroup">
								<img src={LoudMusic} alt="Drinking Icon" />
								<span className="name">Loud-Music</span>
							</div>
							<input
								type="checkbox"
								checked={pgRules.loud_music === "Allowed"}
								onChange={() => handleRulesChange("loud_music")}
								style={{ marginTop: 16, cursor: "pointer" }}
							/>
						</label>
						<label className="mb-2 checkButtons">
							<div className="imageNameGroup">
								<img src={Party} alt="Party Icon" />
								<span className="name">Party</span>
							</div>
							<input
								type="checkbox"
								checked={pgRules.party === "Allowed"}
								onChange={() => handleRulesChange("party")}
								style={{ marginTop: 16, cursor: "pointer" }}
							/>
						</label>
					</div>
					<div
						className="d-flex flex-row gap-2"
						style={{ gap: "8px" }}
					>
						<label className="mb-2 checkButtons">
							<div className="imageNameGroup">
								<img
									src={VisitorEntry}
									alt="Visitor Entry Icon"
								/>
								<span className="name">Visitor Entry</span>
							</div>
							<input
								type="checkbox"
								checked={pgRules.visitor_entry === "Allowed"}
								onChange={() =>
									handleRulesChange("visitor_entry")
								}
								style={{ marginTop: 16, cursor: "pointer" }}
							/>
						</label>
					</div>
				</div>
			</Form.Group>
		</Form>
	);
}
