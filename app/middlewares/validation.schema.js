const Joi = require('joi');
const JoiOid = require('joi-oid');

const now = Date.now();
const cutoffDate = new Date(now - (1000 * 60 * 60 * 24 * 365 * 13)); // go back by 13 years

const validationSchemas = {
	// entity ID validation schema
	entityId: Joi.object({
		id: Joi.string().label('ID param').required()
	}),
	// authentication endpoint validation schema
	authenticateUser: Joi.object({
		username: Joi.string().label('Username').min(3).max(30).required(),
		password: Joi.string().label('Password').required()
	}),
	// register endpoint validation schema
	userAdd: Joi.object({
		firstName: Joi.string().label('First Name').alphanum().min(3).max(30).required(),
		lastName: Joi.string().label('Last Name').alphanum().min(3).max(30).required(),
		username: Joi.string().label('Username').min(3).max(30).required(),
		password: Joi.string().label('Password').min(3).max(30).required()
	}),
	// add product endpoint validation schema
	productAdd: Joi.object({
		sku: Joi.string().label('SKU').required(),
		name: Joi.string().label('Product name').min(3).max(30).required(),
		brand: Joi.string().label('Product brand').min(3).max(30).required(),
		price: Joi.number().label('Price').required(),
		quantity: Joi.number().label('Quantity').required(),
		vendor: JoiOid.objectId().label('Vendor').required()
	}),
	// update products endpoint validation schema
	productUpdate: Joi.object({
		name: Joi.string().label('Product name').min(3).max(30),
		brand: Joi.string().label('Product brand').min(3).max(30),
		price: Joi.number().label('Price'),
		quantity: Joi.number().label('Quantity'),
		vendor: JoiOid.objectId().label('Vendor').required()
	}),
	// get products endpoint validation schema
	productsList: Joi.object({
		sku: Joi.string().label('SKU'),
		name: Joi.string().label('Product name').min(3).max(30),
		brand: Joi.string().label('Product brand').min(3).max(30),
		price: Joi.number().label('Price'),
		quantity: Joi.number().label('Quantity'),
		vendor: JoiOid.objectId().label('Vendor'),
		status: Joi.string().label('Status'),
		search: Joi.string().allow('').max(128),
		page: Joi.number().label('Page'),
		limit: Joi.number().label('Limit')
	}),
	// register endpoint validation schema
	orderAdd: Joi.object({
		customerName: Joi.string().label('Customer name').min(3).max(30).required(),
		customerAddress: Joi.string().label('Customer address').min(3).max(128).required(),
		vendor: JoiOid.objectId().label('Vendor').required(),
		orderLines: Joi.array().items({
			sku: Joi.string().label('Product ID').required(),
			name: Joi.string().label('Product name').required(),
			price: Joi.number().label('Product order price').required(),
			quantity: Joi.number().label('Product order quantity').required()
		}).label('Order Products').required(),
	}),
	// update products endpoint validation schema
	orderUpdate: Joi.object({
		customerName: Joi.string().label('Product name').min(3).max(30),
		customerAddress: Joi.string().label('Product brand').min(3).max(30),
		deliveryDate: Joi.number().label('Price'),
		status: Joi.string().label('Status'),
		cancelReason: Joi.string().label('Cancel reason'),
		vendor: JoiOid.objectId().label('Vendor').required()
	}),
	// get orders endpoint validation schema
	ordersList: Joi.object({
		orderNumber: Joi.string().label('Order number'),
		customerName: Joi.string().label('Customer name').min(3).max(30),
		customerAddress: Joi.string().label('customer address').min(3).max(30),
		vendor: JoiOid.objectId().label('Vendor'),
		status: Joi.string().label('Status'),
		search: Joi.string().allow('').max(128),
		page: Joi.number().label('Page'),
		limit: Joi.number().label('Limit')
	}),
};

module.exports = validationSchemas;