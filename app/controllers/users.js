const UsersService = require("../services/UsersService");
const UsersServiceInstance = new UsersService();

exports.login = async (req, res) => {
	try {
		const authenticatedUser = await UsersServiceInstance.authenticate(req.body);
		if (authenticatedUser.success) {
			// User was authenticated successfully with no errors
			if (authenticatedUser.data.accessToken) {
				res.cookie("jwt", authenticatedUser.data.accessToken, { httpOnly: true })
				delete authenticatedUser.data.accessToken;
			}
			return res.send(authenticatedUser.data);
		} else {
			// An error occured while authenticating user
			res.status(400).send(authenticatedUser.errors);
		}
	} catch (err) {
		// an internal server error occured
		res.status(500).send(err);
	}
}

exports.logout = async (req, res) => {
	try {
		if (req.cookies.user_sid) {
			res.clearCookie("user_sid");
		}
		return res.send({});
	} catch (err) {
		// an internal server error occured
		res.status(500).send(err);
	}
}

// Create and Save a new User
exports.create = async (req, res) => {
	try {
		const createdUser = await UsersServiceInstance.create(req.body);
		if (createdUser.success) {
			// User was created successfully with no errors
			return res.send(createdUser.data);
		} else {
			// An error occured while creating user
			res.status(400).send(createdUser.errors);
		}
	} catch (err) {
		// an internal server error occured
		res.status(500).send(err);
	}
};

// Retrieve user(s)
exports.find = async (req, res) => {
	try {
		const findResult = await UsersServiceInstance.find(req.body);
		if (findResult.success) {
			// Query was successful
			return res.send(findResult.data);
		} else {
			// Query was unsuccessful
			res.status(400).send(findResult.errors);
		}
	} catch (err) {
		// an internal server error occured
		res.status(500).send(err);
	}
};

// Update a User
exports.update = async (req, res) => {
	try {
		const updatedUser = await UsersServiceInstance.update(req.body);
		if (updatedUser.success) {
			// User was updated successfully with no errors
			return res.send(updatedUser.data);
		} else {
			// An error occured while updating user
			res.status(400).send(updatedUser.errors);
		}
	} catch (err) {
		// an internal server error occured
		res.status(500).send(err);
	}
};

