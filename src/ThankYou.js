import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ThankYou() {
	const navigate = useNavigate();
	const [count, setCount] = useState(5);

	useEffect(() => {
		const countdownInterval = setInterval(() => {
			setCount((prevCount) => {
				if (prevCount > 1) {
					return prevCount - 1;
				} else {
					clearInterval(countdownInterval);
					return prevCount;
				}
			});
		}, 1000);

		const redirectTimeout = setTimeout(() => {
			navigate("/");
		}, 5000);

		return () => {
			clearInterval(countdownInterval);
			clearTimeout(redirectTimeout);
		};
	}, [navigate]);

	return (
		<div>
			Thank You
			<br />
			You will be redirected to home page in: {count}
		</div>
	);
}

export default ThankYou;
