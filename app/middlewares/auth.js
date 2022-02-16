const jwt = require('jsonwebtoken');
const UsersService = require("../services/UsersService");
const UsersServiceInstance = new UsersService();

const authMiddleware = () => {
	return async (req, res, next) => {
		if (req.cookies.jwt) {
			let payload;
			try {
				// verify JWT in the request
				payload = jwt.verify(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET);
				payload.status = 'Active';
				const findResult = await UsersServiceInstance.find(payload);
				if (findResult.success) {
					// Query was successful
					// set response cookie
					res.cookie("jwt", req.cookies.jwt, { httpOnly: true });
					next();
				} else {
					// Query was unsuccessful
					res.clearCookie("jwt");
					res.status(403).json({
						error: 'Your session is invalid'
					});
				}
			} catch (e) {
				// error validating session, clear cookie and return with failure
				res.clearCookie("jwt");
				res.status(403).json({
					error: 'Your session is invalid'
				});
			}
		} else {
			res.status(403).json({
				error: 'Session Not Found'
			});
		}
	};
}

module.exports = authMiddleware;