import React from "react";
import "./Styles/HomePage.css";
import Header from "./Header";
import SearchBar from "./SearchBar";

export default function HomePage() {
	return (
		<div className="homePage">
			<div className="container" style={{ maxWidth: 1376 }}>
				<Header />
				<div
					className="d-flex flex-column align-items-center"
					style={{ marginTop: 224, gap: 23 }}
				>
					<h2 className="findStay">Find your best stay</h2>
					<p className="explore">
						Explore our extensive selection of comfortable and
						convenient accommodations tailored to meet your new
						beginnings
					</p>
					<div className="searchBarPosition1">
						<SearchBar />
					</div>
				</div>
			</div>
		</div>
	);
}
