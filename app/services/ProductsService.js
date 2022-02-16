
const MongooseService = require("./MongooseService");
const Base = require('./BaseService');
const db = require("../models");
const ProductModel = db.products;
const _ = require('lodash');
const OrdersService = require("./OrdersService");
const { mongoose } = require("../models");
const OrdersServiceInstance = new OrdersService();

class ProductsService extends Base {
	/**
	 * @description Create an instance of ProductsService
	 */
	constructor() {
		super();

		// Instantiate mongoose service for products model
		this.productsMongooseServiceInstance = new MongooseService(ProductModel);
	}

	// Add new product
	add = async (payload) => {
		// confirm that the payload is not empty
		if (_.isUndefined(payload) || !_.isObject(payload)) {
			return this.sendFailedResponse({ error: "Bad request, request payload not found" });
		}

		// check if product with specified name has already been added by the specified vendor
		var productExists = false;
		if (payload.name && payload.vendor) {
			const checkProduct = await this.productsMongooseServiceInstance.findOne({ name: payload.name, vendor: payload.vendor });
			if (checkProduct) {
				productExists = true;
			}
		}

		// if product does not exist, add it as a new product
		if (!productExists) {
			payload.status = "Active";
			try {
				// Save new product
				const result = await this.productsMongooseServiceInstance.create(payload);
				// return created product
				return this.sendSuccessResponse(result);
			} catch (err) {
				return this.sendFailedResponse(err);
			}
		} else {
			// return error if product already exist
			return this.sendFailedResponse({ name: `A product with name "${payload.name}" already exists in your catalogue` });
		}
	}

	// Find a product
	find = async (payload) => {
		// confirm that the payload has a valid id field 
		if (!payload || !payload.id) {
			return this.sendFailedResponse({ error: "Bad request, product ID not found in the request" });
		}
		// Find product by id
		try {
			const result = await this.productsMongooseServiceInstance.findById(payload.id);
			if(result && result.status && result.status === 'Active')
				return this.sendSuccessResponse(result);
			else	
				return this.sendFailedResponse({ error: 'Product not found' });
		} catch (err) {
			return this.sendFailedResponse(err);
		}
	}

	// Find all products by criteria
	findAll = async (payload) => {
		// confirm that the payload is not empty
		if (_.isUndefined(payload) || !_.isObject(payload)) {
			return this.sendFailedResponse({ error: "Bad request, request payload not found" });
		}
		
		// get page option from payload or use default if not provided
		const page = payload.page ? payload.page : 1;
		if(payload.page)
			delete payload.page
		// get limit option from payload or use default if not provided
		const limit = payload.limit ? payload.limit : 6;
		if(payload.limit)
			delete payload.limit
		// set skip offset by multiping the specified page index by the limit count
		const skip = (page - 1) * limit;
		// if payload has a search field, perform a text search
		if(payload.search == '') delete payload.search; 
		if(payload.search){
			// find products by text search
			try {
				let searchValue = payload.search;
				delete payload.search;
				let results = await this.productsMongooseServiceInstance.find({...payload, status: "Active", "$text": {"$search": searchValue}}, null, {createdAt: -1}, { skip, limit });
				const totalRecords = await this.productsMongooseServiceInstance.count({...payload, status: "Active", "$text": {"$search": searchValue}});
				const totalPages = Math.ceil(totalRecords/limit);
				return this.sendSuccessResponse({results, limit, page, totalPages});
			} catch (err) {
				return this.sendFailedResponse({ error: 'An error occured processing the request, try again' });
			}
		}else {
			// Find products by payload fields
			try {
				let results = await this.productsMongooseServiceInstance.find({...payload, status: "Active"}, null, {createdAt: -1}, { skip, limit });
				const totalRecords = await this.productsMongooseServiceInstance.count({...payload, status: "Active"});
				const totalPages = Math.ceil(totalRecords/limit);
				return this.sendSuccessResponse({results, limit, page, totalPages});
			} catch (err) {
				return this.sendFailedResponse({ error: 'An error occured processing the request, try again' });
			}
		}
	}
	
	// Update a User
	update = async (param, payload) => {

		// confirm that the payload is not empty
		if (_.isUndefined(payload) || !_.isObject(payload) || !param || !param.id) {
			return this.sendFailedResponse({ error: "Bad request, request payload is invalid" });
		}

		// get product by id
		const productFind = await this.find(param);
		if (productFind.success) {
			const productData = productFind.data;
			if(productData.vendor && productData.vendor == payload.vendor){
				payload = { ...productData, ...payload };
				delete productData._id; // remove id value from post data to prevent curruption 

				// if price is being updated, reject the change if the product is in a pending order
				if(payload.price !== productData.price){
					const pendingOrdersWithProduct = await OrdersServiceInstance.findAll({orderLines: {"$elemMatch": {sku: productData.sku}}, status: "Pending"});
					if(pendingOrdersWithProduct.success && pendingOrdersWithProduct.data.length){
						return this.sendFailedResponse({ price: 'Can not change product price for a product in a pending order' });
					}
				}
				
				// update product
				try {
					const result = await this.productsMongooseServiceInstance.update(param.id, payload);
					if (result) {
						return this.sendSuccessResponse(result);
					} else {
						return this.sendFailedResponse({ error: 'Product updated failed' });
					}
				} catch (err) {
					return this.sendFailedResponse(err);
				}
			}else{
				return this.sendFailedResponse({ error: 'You do not have permission to update this product' });
			}
		} else {
			return this.sendFailedResponse({ error: 'Product not found' });
		}
	}
	
	// Update a User
	delete = async (payload) => {

		// confirm that the payload is not empty
		if (!payload || !payload.id) {
			return this.sendFailedResponse({ error: "Bad request, request payload is invalid" });
		}

		// get product by id
		const productFind = await this.find(payload);
		if (productFind.success) {
			const productData = productFind.data;
			// reject deletion if the product is in a pending order
			const pendingOrdersWithProduct = await OrdersServiceInstance.findAll({orderLines: {"$elemMatch": {sku: productData.sku}}, status: "Pending"});
			if(pendingOrdersWithProduct.data.results.length){
				return this.sendFailedResponse({ price: 'Can not delete a product that is in a pending order' });
			}

			// delete product
			try {
				const result = await this.productsMongooseServiceInstance.update(payload.id, {status: "Inactive"});
				if (result) {
					return this.sendSuccessResponse(true);
				} else {
					return this.sendFailedResponse({ error: 'Product delete failed' });
				}
			} catch (err) {
				return this.sendFailedResponse(err);
			}
		} else {
			return this.sendFailedResponse({ error: 'Product not found, might have already been deleted' });
		}
	}
}

module.exports = ProductsService;