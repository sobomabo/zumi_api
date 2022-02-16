const { faker } = require('./node_modules/@faker-js/faker');
const db = require("./app/models");
const bcrypt = require('bcrypt');
const { randomString, containsObject } = require('./app/utils/helper');

async function seedDB() {
	// db connection
	await db.mongoose.connect(db.url, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	}).then(() => {
		console.log("Connected to the database!");
	}).catch(err => {
		console.log("Cannot connect to the database!", err);
		process.exit();
	});


	// build user data for 5 vendors
	const users = [];
	for (let i = 0; i < 5; i++) {
		const firstName = faker.name.firstName();
		const lastName = faker.name.lastName();
		const password = faker.internet.password(6, true);
		const passwordHash = await bcrypt.hash(password, 10);
		const vendor = {
			firstName: firstName,
			lastName: lastName,
			username: faker.internet.userName("Vendor", firstName),
			password: passwordHash,
			type: "Vendor",
			status: "Active"
		}
		// add plain password to user return object for reference
		vendor.plainPassword = password;
		// add vendors to users list
		users.push(vendor)
	}

	// create users
	let createdUsers;
	if (users.length) {
		try {
			// clear current user collection
			await db.users.deleteMany({});
			// insert all users into user collection at once
			createdUsers = await db.users.insertMany(users);
			console.log("users seeded");
			console.log(JSON.stringify(users, null, 4));
		} catch (err) {
			console.log(err)
		}
	}

	// seed products
	let products = [];
	if (createdUsers.length) {
		for (let user of createdUsers) {
			if (user.type === 'Vendor') {
				// build product seeds for vendor, 20 products
				for (let i = 0; i < 20; i++) {

					const product = {
						sku: randomString(6),
						name: faker.commerce.productName(),
						brand: faker.company.companyName(),
						price: faker.commerce.price(100, 1000),
						quantity: faker.datatype.number({min: 80, max:100}),
						vendor: user.id,
						status: "Active"
					}

					products.push(product)
				}
			}
		}

		if (products.length) {
			try {
				// clear products collection
				await db.products.deleteMany({});
				// insert all products into products collection at once
				createdProducts = await db.products.insertMany(products);
				console.log("products seeded");
			} catch (err) {
				console.log(err)
			}
		}
	}

	// seed orders
	let orders = [];
	if (createdProducts.length) {
		// seed orders for each vendor
		for (let user of createdUsers) {
			if (user.type === 'Vendor') {
				let vendorOders = [];
				// get all products for the selected vendor
				let vendorProducts = createdProducts.filter(function (o) { return o.vendor == user.id; });
				// remove any "undefined" element from the vendorProducts array
				vendorProducts = vendorProducts.filter(function (element) {
					return element !== undefined;
				});

				// build 20 order records for the selected vendor from the vendor's products
				for (let i = 0; i < 20; i++) {
					// select products to be in the order
					const orderProducts = getProductForVendorOrder(vendorOders, {}, vendorProducts, faker.datatype.number({ min: 1, max: 10 }));
					if(Object.values(orderProducts).length){
						// set an order status at random
						// ["Pending", "Canceled", "Delivered"][Math.floor(Math.random() * 3)]
						const orderStatus = "Pending";
						// set date of delivery to null by default, but assign a date in the past if order status is delivered
						let dateDelivered = null;
						if (orderStatus === "Delivered") {
							dateDelivered = faker.date.past();
						}
						// build order data
						const order = {
							orderNumber: randomString(5),
							customerName: faker.name.findName(),
							customerAddress: faker.address.streetAddress(true) + ", " + faker.address.city() + ", " + faker.address.stateAbbr() + ", " + faker.address.country(),
							vendor: user.id,
							orderLines: Object.values(orderProducts),
							deliveryDate: dateDelivered,
							status: orderStatus
						}
						// add order data to vendor's orders
						vendorOders.push(order)
					}
				}

				// combine list of all orders for all vendors to be inserted at once
				orders.push(...vendorOders)
			}
		}

		if (orders.length) {
			// clear orders collection
			await db.orders.deleteMany({});
			// insert all orders into orders collection at once
			createdOrders = await db.orders.insertMany(orders);
			console.log("orders seeded");
		}
	}

	// helper function to recussively add products to an order for a vendor, so that products are not repeated and are added according to availabel quantity in an order
	function getProductForVendorOrder(vendorOders, vendorOrderProducts, vendorProducts, orderSize) {
		// check if there are items available in the products list to be added to the order, and that there are still products available to be added to the list,
		// or return the current list if either of the abovve conditions is false
		if ((Object.keys(vendorOrderProducts)).length < orderSize && vendorProducts.length) {
			// select a key at random from the available vendor products list
			const selectedProductKey = Math.floor(Math.random() * vendorProducts.length);
			// pick product the selected key
			const product = vendorProducts[selectedProductKey];
			// set an order quantity for the selected product
			const productOrderQty = faker.datatype.number({min: 1, max:5});
			// build order info for selected product 
			const orderDetails = {
				sku: product.sku,
				name: product.name,
				price: product.price * productOrderQty,
				quantity: productOrderQty
			}
			// check that the selected product does not already exist in the current vendore order product list
			if(Object.keys(vendorOrderProducts).length < 1 || !Object.keys(vendorOrderProducts).includes(product.sku)){
				// check the total order quantity of the product does not exeed the available product quantity
				let totalOrderQty = 0; // intialize a count for total quantity of the product ordered so far
				vendorOders.forEach((x, i) => { 
					// for each vendor order, check through its order lines to if this products exists
					x.orderLines.forEach((y, i) => { 
						if(y.sku == product.sku){
							// increment the totalOrder quanty by each quantity of the product ordered so far
							totalOrderQty += y.quantity;
						}
					});
				});
				if (product.quantity >= (totalOrderQty + productOrderQty)) {
					// add the product order detail to the current vendor product order list
					vendorOrderProducts[product.sku] = orderDetails;
					// remove the added product from the list available vendor product to be considered in the current order products building cycle
					vendorProducts.splice(selectedProductKey,1);
				}
			}

			// recurssively call the getProductForVendorOrder wiith the updated list of products added to the current order and updated list of available products to consider
			return getProductForVendorOrder(vendorOders, vendorOrderProducts, vendorProducts, orderSize)
			
		} else {
			return vendorOrderProducts;
		}
	}

}
seedDB().then(() => {
	db.mongoose.connection.close()
});