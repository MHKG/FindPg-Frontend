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
				<img
					alt="Google"
					src={require("../images/google.png")}
					width={"60%"}
				/>
			</div>
		</div>
	);
}
