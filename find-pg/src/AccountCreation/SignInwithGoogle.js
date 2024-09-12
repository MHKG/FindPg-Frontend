export default function SignInwithGoogle({ onClick }) {
	return (
		<div>
			<p className="continue-p">--Or continue with--</p>
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					cursor: "pointer",
				}}
				onClick={onClick}
			>
				<img src={require("../images/google.png")} width={"60%"} />
			</div>
		</div>
	);
}
