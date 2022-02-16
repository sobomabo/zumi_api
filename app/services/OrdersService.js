const MongooseService = require("./MongooseService");
const Base = require('./BaseService');
const db = require("../models");
const OrderModel = db.orders;
const _ = require('lodash');
const { randomString } = require("../utils/helper");

class OrdersService extends Base {
	/**
	 * @description Create an instance of OrdersService
	 */
	constructor() {
		super();

		// Instantiate mongoose service for user model
		this.orderMongooseServiceInstance = new MongooseService(OrderModel);
	}

	// Add new order
	add = async (payload) => {
		// confirm that the payload is not empty
		if (_.isUndefined(payload) || !_.isObject(payload)) {
			return this.sendFailedResponse({ error: "Bad request, request payload not found" });
		}

		// check if order with specified customer name and Ordereedd products has already been created
		var orderExists = false;
		if (payload.name && payload.vendor) {
			const checkOrder = await this.orderMongooseServiceInstance.find({ customerName: payload.customerName, orderLines: {"$eq": payload.orderLines}, status: "Pending"});
			if (checkOrder) {
				orderExists = true;
			}
		}
		// if the order does not exist, add it as a new order
		if (!orderExists) {
			payload.status = "Pending"; // set the order status to pedning by default
			payload.orderNumber = randomString(5); // generate order number for the order

			try {
				// Save new order
				const result = await this.orderMongooseServiceInstance.create(payload);
				// return created order
				return this.sendSuccessResponse(result);
			} catch (err) {
				return this.sendFailedResponse(err);
			}
		} else {
			// return error if product already exist
			return this.sendFailedResponse({ name: `This order has already been created` });
		}
	}


	// Find an order
	find = async (payload) => {
		// confirm that the payload has a valid id field 
		if (!payload || !payload.id) {
			return this.sendFailedResponse({ error: "Bad request, order ID not found in the request" });
		}

		// Find order by id
		try {
			const result = await this.orderMongooseServiceInstance.findById(payload.id)
			if(result)
				return this.sendSuccessResponse(result);
			else	
				return this.sendFailedResponse({ error: 'Order not found' });
		} catch (err) {
			return this.sendFailedResponse(err);
		}
	}

	// Find all orders by criteria
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
			// find orders by text search
			try {
				let searchValue = payload.search;
				delete payload.search;
				let results = await this.orderMongooseServiceInstance.find({...payload, "$text": {"$search": searchValue}}, null, {createdAt: -1}, { skip, limit });
				const totalRecords = await this.orderMongooseServiceInstance.count({...payload, "$text": {"$search": searchValue}});
				const totalPages = Math.ceil(totalRecords/limit);
				return this.sendSuccessResponse({results, limit, page, totalPages});
			} catch (err) {
				return this.sendFailedResponse({ error: 'An error occured processing the request, try again' });
			}
		}else {
			// Find orders by payload fields
			try {
				let results = await this.orderMongooseServiceInstance.find(payload, null, {createdAt: -1}, { skip, limit });
				const totalRecords = await this.orderMongooseServiceInstance.count(payload);
				const totalPages = Math.ceil(totalRecords/limit);
				return this.sendSuccessResponse({results, limit, page, totalPages});
			} catch (err) {
				return this.sendFailedResponse({ error: 'An error occured processing the request, try again' });
			}
		}
	}

	// Update an order
	update = async (param, payload) => {

		// confirm that the payload and param are not empty
		if (_.isEmpty(payload) || !_.isObject(payload) || !param || !param.id) {
			return this.sendFailedResponse({ error: "Bad request, request payload is invalid" });
		}

		// get the order by id
		const orderFind = await this.find(param);
		if (orderFind.success) {
			const orderData = orderFind.data;
			payload = { ...orderData, ...payload };
			delete orderData._id; // remove id value from post data to prevent curruption 

			// if order has been delivered, prevent any further update of the record
			if(orderData.status === "Delivered"){
				return this.sendFailedResponse({ price: 'Can not update a closed order' });
			}

			// if the order status is changing to "Delivered", set the current time stamp as the date delivered
			if(payload.status && payload.status === 'Delivered'){
				payload.deliveryDate = new Date();
			}
			
			// update the order
			try {
				const result = await this.orderMongooseServiceInstance.update(param.id, payload);
				if (result) {
					return this.sendSuccessResponse(result);
				} else {
					return this.sendFailedResponse({ error: 'Order updated failed' });
				}
			} catch (err) {
				return this.sendFailedResponse(err);
			}
		} else {
			return this.sendFailedResponse({ error: 'Order not found' });
		}
	}
	
}

module.exports = OrdersService;