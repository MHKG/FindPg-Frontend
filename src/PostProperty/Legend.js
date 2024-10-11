import { ListGroup } from "react-bootstrap";
import "../Styles/Legend.css";

export default function Legend({ currentPage }) {
	const titles = [
		"Location",
		"Property Details",
		"Pricing details",
		"Photos of Pg",
		"Photos of Rooms",
		"Food Menu",
		"Contact Details",
	];

	const renderPages = () => {
		let pages = [];
		for (let i = 1; i <= titles.length; i++) {
			if (i < currentPage) {
				pages.push(
					<ListGroup.Item key={i} className="completed">
						<div className="circle completed">
							<span className="numbers">&#10003;</span>
						</div>
						<span className="title">{titles[i - 1]}</span>
					</ListGroup.Item>
				);
			} else if (i === currentPage) {
				pages.push(
					<ListGroup.Item key={i} className="current">
						<div className="circle current">
							<span className="numbers">{i}</span>
						</div>
						<span className="title">{titles[i - 1]}</span>
					</ListGroup.Item>
				);
			} else {
				pages.push(
					<ListGroup.Item key={i} className="upcoming">
						<div className="circle upcoming">
							<span className="numbers">{i}</span>
						</div>
						<span className="title">{titles[i - 1]}</span>
					</ListGroup.Item>
				);
			}
		}
		return pages;
	};

	return <ListGroup className="legend">{renderPages()}</ListGroup>;
}
