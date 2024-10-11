export const validate = (field, value, messageSetter, password) => {
	switch (field) {
		case "email":
			const emailRegex =
				/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9]))+$/;

			if (!emailRegex.test(value)) {
				messageSetter("Invalid Email.");
				return false;
			} else {
				messageSetter("");
				return true;
			}

		case "password":
			const passwordRegex =
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

			if (!passwordRegex.test(value)) {
				messageSetter(
					"Password must be at least 6 characters long, contain one uppercase letter, one lowercase letter, one number, and one special character."
				);
				return false;
			} else {
				messageSetter("");
				return true;
			}

		case "verifyPassword":
			if (value !== password) {
				messageSetter("Password doesnt match");
				return false;
			} else {
				messageSetter("");
				return true;
			}
	}
};
