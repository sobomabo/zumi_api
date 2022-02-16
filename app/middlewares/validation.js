const _ = require('lodash');


const validationMiddleware = (schema, property) => {
	return (req, res, next) => {
		const { error } = schema.validate(req[property], { abortEarly: false });
		const valid = error == null;
		if (valid) {
			next();
		} else {
			const { details } = error;
			var message = {};
			details.map(i => message[i.path] = i.message);

			res.status(400).json(message)
		}
	}
}

module.exports = validationMiddleware;