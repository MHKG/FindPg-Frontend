import "./Styles/App.css";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import PageNotFound from "./PageNotFound";
import ThankYou from "./ThankYou";
import ListOfPg from "./ListOfPg/ListOfPG";
import PostProperty from "./PostProperty/PostProperty";
import Pricing from "./PostProperty/Pricing";
import PgPhotosUpload from "./PostProperty/PgPhotosUpload";
import ContactDetails from "./PostProperty/ContactDetails";
import PgDetails from "./PostProperty/PgDetails";
import PgAllInfo from "./PgAllInfo/PgAllInfo";
import RoomsPhotosUpload from "./PostProperty/RoomsPhotosUpload";
import FoodMenuDetails from "./PostProperty/FoodMenuDetails";
import ProfileView from "./ProfileView";
import ResetPassword from "./AccountCreation/ResetPassword";
import FetchAllPgByOwner from "./FetchAllPgByOwner";

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/ListOfPg/:location" element={<ListOfPg />} />
				<Route path="/PostProperty" element={<PostProperty />} />
				<Route path="/PgDetails" element={<PgDetails />} />
				<Route path="/Pricing" element={<Pricing />} />
				<Route path="/PgPhotosUpload" element={<PgPhotosUpload />} />
				<Route
					path="/RoomsPhotosUpload"
					element={<RoomsPhotosUpload />}
				/>
				<Route path="/FoodMenuDetails" element={<FoodMenuDetails />} />
				<Route path="/ContactDetails" element={<ContactDetails />} />
				<Route path="/PgAllInfo" element={<PgAllInfo />} />
				<Route path="/ProfileView" element={<ProfileView />} />
				<Route
					path="/FetchAllPgByOwner"
					element={<FetchAllPgByOwner />}
				/>
				<Route path="/ThankYou" element={<ThankYou />} />
				<Route path="*" element={<PageNotFound />} />
				<Route path="/resetPassword" element={<ResetPassword />} />
			</Routes>
		</BrowserRouter>
	);
}
