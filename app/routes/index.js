module.exports = app => {
	const Users = require("../controllers/users.js");
	const Products = require("../controllers/products.js");
	const Orders = require("../controllers/orders.js");
	const validationSchemas = require('../middlewares/validation.schema.js');
	const validationMiddleware = require('../middlewares/validation.js');
	const authMiddleware = require('../middlewares/auth.js');

	var router = require("express").Router();

	// User routes
	// Authenticate user
	router.post("/users/login", validationMiddleware(validationSchemas.authenticateUser, 'body'), Users.login);
	// Create a new user
	router.post("/users", validationMiddleware(validationSchemas.userAdd, 'body'), Users.create);
	// Get a user
	router.post("/users", authMiddleware(), validationMiddleware(validationSchemas.userFind, 'body'), Users.find);
	// Update a user
	router.post("/users/:id", authMiddleware(), validationMiddleware(validationSchemas.userUpdate, 'body'), Users.update);
	// Logout user
	router.post("/users/logout", Users.logout);

	// Product routes
	// Add a new product
	router.post("/products", authMiddleware(), validationMiddleware(validationSchemas.productAdd, 'body'), Products.add);
	// Get a product by id
	router.get("/products/:id", authMiddleware(), Products.find);
	// Update a product
	router.post("/products/:id", authMiddleware(), validationMiddleware(validationSchemas.entityId, 'params'), validationMiddleware(validationSchemas.productUpdate, 'body'), Products.update);
	// get all products by the criteria defined in request query
	router.get("/products", authMiddleware(), validationMiddleware(validationSchemas.productsList, 'query'), Products.findAll);
	// Get a product by id
	router.delete("/products/:id", authMiddleware(), validationMiddleware(validationSchemas.entityId, 'params'), Products.delete);


	// Order routes
	// Add a new order
	router.post("/orders", authMiddleware(), validationMiddleware(validationSchemas.orderAdd, 'body'), Orders.add);
	// Get an order by id
	router.get("/orders/:id", authMiddleware(), validationMiddleware(validationSchemas.entityId, 'params'), Orders.find);
	// Update an order
	router.post("/orders/:id", authMiddleware(), validationMiddleware(validationSchemas.entityId, 'params'), validationMiddleware(validationSchemas.orderUpdate, 'body'), Orders.update);
	// get all orders by the criteria defined in request query
	router.get("/orders", authMiddleware(), validationMiddleware(validationSchemas.ordersList, 'query'), Orders.findAll);

	app.use("/api", router);
};
