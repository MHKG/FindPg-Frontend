export const validate = (field, value, messageSetter, password) => {
	switch (field) {
		case "email": {
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

			if (!emailRegex.test(value)) {
				messageSetter("Invalid Email.");
				return false;
			} else {
				messageSetter("");
				return true;
			}
		}

		case "password": {
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
		}

		case "verifyPassword": {
			if (value !== password) {
				messageSetter("Password doesn't match");
				return false;
			} else {
				messageSetter("");
				return true;
			}
		}

		default:
			return false;
	}
};
