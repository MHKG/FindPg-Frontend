import React, { useState, useRef } from "react";
import Scrollspy from "react-scrollspy";
import Description from "./Description";
import RoomAvailability from "./RoomAvailability";
import "../Styles/DetailsNavigationBar.css";
import FoodMenu from "./FoodMenu";
import AvailableAmenities from "./AvailableAmenities";
import Rules from "./Rules";
import SimilarPGs from "./SimilarPGs";

export default function DetailsNavigationBar({ props }) {
	const [foodAvailable, setFoodAvailable] = useState(true);
	const [similarPgsAvailable, setSimilarPgsAvailable] = useState(true);

	const sectionRefs = {
		section1: useRef(null),
		section2: useRef(null),
		section3: useRef(null),
		section4: useRef(null),
		section5: useRef(null),
		section6: useRef(null),
	};

	const handleScroll = (sectionRef) => {
		if (sectionRef.current) {
			sectionRef.current.scrollIntoView({ behavior: "smooth" });
		}
	};

	return (
		<div>
			<Scrollspy
				className="detailsNavigationBar"
				items={[
					"section-1",
					"section-2",
					"section-3",
					"section-4",
					"section-5",
					"section-6",
				]}
				currentClassName="is-current"
			>
				<a
					href="#section-1"
					onClick={() => handleScroll(sectionRefs.section1)}
					className="titles"
				>
					<div className="d-flex flex-column gap-2">
						<div style={{ marginLeft: 14, marginRight: 13 }}>
							Description
						</div>
						<span className="active-indicator"></span>
					</div>
				</a>

				<a
					href="#section-2"
					onClick={() => handleScroll(sectionRefs.section2)}
					className="titles"
				>
					<div className="d-flex flex-column gap-2">
						<div style={{ marginLeft: 14, marginRight: 13 }}>
							Room Availability
						</div>
						<span className="active-indicator"></span>
					</div>
				</a>

				<a
					href="#section-3"
					onClick={() => handleScroll(sectionRefs.section3)}
					className="titles"
				>
					<div className="d-flex flex-column gap-2">
						<div style={{ marginLeft: 14, marginRight: 13 }}>
							Food Menu
						</div>
						<span className="active-indicator"></span>
					</div>
				</a>

				<a
					href="#section-4"
					onClick={() => handleScroll(sectionRefs.section4)}
					className="titles"
				>
					<div className="d-flex flex-column gap-2">
						<div style={{ marginLeft: 14, marginRight: 13 }}>
							Amenities
						</div>
						<span className="active-indicator"></span>
					</div>
				</a>

				<a
					href="#section-5"
					onClick={() => handleScroll(sectionRefs.section5)}
					className="titles"
				>
					<div className="d-flex flex-column gap-2">
						<div style={{ marginLeft: 14, marginRight: 13 }}>
							House Rules
						</div>
						<span className="active-indicator"></span>
					</div>
				</a>

				<a
					href="#section-6"
					onClick={() => handleScroll(sectionRefs.section6)}
					className="titles"
				>
					<div className="d-flex flex-column gap-2">
						<div style={{ marginLeft: 14, marginRight: 13 }}>
							Similar PGs
						</div>
						<span className="active-indicator"></span>
					</div>
				</a>
			</Scrollspy>

			<div>
				<div ref={sectionRefs.section1}>
					<Description props={props} />
				</div>
				<div ref={sectionRefs.section2}>
					<RoomAvailability props={props} />
				</div>
				<div ref={sectionRefs.section3}>
					<FoodMenu props={props} foodAvailable={foodAvailable} />
				</div>
				<div ref={sectionRefs.section4}>
					<AvailableAmenities
						setFoodAvailable={setFoodAvailable}
						props={props}
					/>
				</div>
				<div
					ref={sectionRefs.section5}
					style={{
						marginBottom: similarPgsAvailable ? "12px" : "64px",
					}}
				>
					<Rules props={props} />
				</div>
				<div ref={sectionRefs.section6}>
					<SimilarPGs
						props={props}
						setSimilarPgsAvailable={setSimilarPgsAvailable}
					/>
				</div>
			</div>
		</div>
	);
}
