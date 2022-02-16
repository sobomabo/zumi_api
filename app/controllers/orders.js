const OrdersService = require("../services/OrdersService");
const OrdersServiceInstance = new OrdersService();

// Add a new order
exports.add = async (req, res) => {
	try {
		const createdOrder = await OrdersServiceInstance.add(req.body);
		if (createdOrder.success) {
			// User was created successfully with no errors
			return res.send(createdOrder.data);
		} else {
			// An error occured while creating user
			res.status(400).send(createdOrder.errors);
		}
	} catch (err) {
		// an internal server error occured
		res.status(500).send(err);
	}
};

// Retrieve an order by id
exports.find = async (req, res) => {
	try {
		const findResult = await OrdersServiceInstance.find(req.params);
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

// Retrieve orders by criteria
exports.findAll = async (req, res) => {
	try {
		const findResult = await OrdersServiceInstance.findAll(req.query);
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

// Update an order
exports.update = async (req, res) => {
	try {
		const updatedOrder = await OrdersServiceInstance.update(req.params, req.body);
		if (updatedOrder.success) {
			// Order was updated successfully with no errors
			return res.send(updatedOrder.data);
		} else {
			// An error occured while updating the order
			res.status(400).send(updatedOrder.errors);
		}
	} catch (err) {
		// an internal server error occured
		res.status(500).send(err);
	}
};

