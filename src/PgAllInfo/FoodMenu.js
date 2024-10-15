import { useEffect, useState } from "react";
import "../Styles/FoodMenu.css";
import { axiosInstance } from "../AxiosInstance";

export default function FoodMenu({ foodAvailable }) {
	const [foodMenu, setFoodMenu] = useState([]);

	const pg_id = sessionStorage.getItem("pg_id");

	useEffect(() => {
		const fetchPgMenu = async () => {
			try {
				const response = await axiosInstance.post(
					"/food_menu_controller/getByPgId",
					new URLSearchParams({ pg_id: pg_id }),
					{
						headers: {
							Authorization:
								"Bearer " + sessionStorage.getItem("token"),
						},
					}
				);
				setFoodMenu(response.data);
			} catch (error) {
				console.error("Error fetching Pg Menu: ", error);
				return;
			}
		};

		fetchPgMenu();
	}, [pg_id]);

	const daysOfWeek = [
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
		"Sunday",
	];

	return (
		<section id="section-3">
			<h2 className="foodMenu">Food Menu</h2>
			{foodAvailable ? (
				<table className="table">
					<thead>
						<tr>
							<th scope="col">Days</th>
							<th scope="col">Breakfast</th>
							<th scope="col">Lunch</th>
							<th scope="col">Dinner</th>
						</tr>
					</thead>
					<tbody>
						{daysOfWeek.map((day, index) => {
							let menu;
							if (foodMenu.length > 0) {
								menu = foodMenu.find(
									(item) => item.days_id === index + 1
								);
								return (
									<tr key={index}>
										<th scope="row">{day}</th>
										<td>{menu.breakfast}</td>
										<td>{menu.lunch}</td>
										<td>{menu.dinner}</td>
									</tr>
								);
							} else {
								return null;
							}
						})}
					</tbody>
				</table>
			) : (
				<div>No food available</div>
			)}
		</section>
	);
}
