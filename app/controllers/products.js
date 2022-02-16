const ProductsService = require("../services/ProductsService");
const ProductsServiceInstance = new ProductsService();

// Add new product
exports.add = async (req, res) => {
	try {
		const createdProduct = await ProductsServiceInstance.add(req.body);
		if (createdProduct.success) {
			// User was created successfully with no errors
			return res.send(createdProduct.data);
		} else {
			// An error occured while creating user
			res.status(400).send(createdProduct.errors);
		}
	} catch (err) {
		// an internal server error occured
		res.status(500).send(err);
	}
};

// Retrieve product by id
exports.find = async (req, res) => {
	try {
		const findResult = await ProductsServiceInstance.find(req.params);
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

// Retrieve products by criteria
exports.findAll = async (req, res) => {
	try {
		const findResult = await ProductsServiceInstance.findAll(req.query);
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

// Update a product
exports.update = async (req, res) => {
	try {
		const updatedProduct = await ProductsServiceInstance.update(req.params, req.body);
		if (updatedProduct.success) {
			// Product was updated successfully with no errors
			return res.send(updatedProduct.data);
		} else {
			// An error occured while updating product
			res.status(400).send(updatedProduct.errors);
		}
	} catch (err) {
		// an internal server error occured
		res.status(500).send(err);
	}
};

// Delete a product
exports.delete = async (req, res) => {
	try {
		const deleteResult = await ProductsServiceInstance.delete(req.params);
		if (deleteResult.success) {
			// Product was deleted successfully with no errors
			return res.send(deleteResult.data);
		} else {
			// An error occured while deleteing product
			res.status(400).send(deleteResult.errors);
		}
	} catch (err) {
		// an internal server error occured
		res.status(500).send(err);
	}
};

