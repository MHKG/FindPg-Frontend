import { useEffect, useState } from "react";
import "../Styles/PgAllInfo.css";
import UserProfile from "./UserProfile";
import Header from "../Header";
import DetailsOfAPg from "./DetailsOfAPg";
import { axiosInstance } from "../AxiosInstance";
import Navigators from "../Navigators";

export default function PgAllInfo() {
	const [ownerId, setOwnerId] = useState();

	const user_id = sessionStorage.getItem("user_id");

	useEffect(() => {
		const fetchPgDetails = async () => {
			const response = await axiosInstance.post(
				"/pg_controller/getByPgId",
				new URLSearchParams({ pg_id: sessionStorage.getItem("pg_id") }),
				{
					headers: {
						Authorization:
							"Bearer " + sessionStorage.getItem("token"),
					},
				}
			);
			if (response.data) {
				setOwnerId(response.data[0].owner_id);
			}
		};

		fetchPgDetails();
	}, []);

	return (
		<div className="pgAllInfo">
			<div className="header">
				<Header params={"inline-flex"} />
			</div>
			<div className="container" style={{ maxWidth: 1376 }}>
				<Navigators />
				<div
					className="d-flex flex-row gap-5"
					style={{ marginTop: 24 }}
				>
					<UserProfile
						ownerId={ownerId}
						mode={
							parseInt(ownerId) === parseInt(user_id)
								? "Edit"
								: "View"
						}
					/>
					<DetailsOfAPg />
				</div>
			</div>
		</div>
	);
}
