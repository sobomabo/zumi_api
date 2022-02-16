module.exports = mongoose => {
	var orderLineSchema
	var schema = mongoose.Schema(
		{
			orderNumber: {
				type: String,
				required: true,
				unique: true
			},
			customerName: {
				type: String,
				trim: true,
				required: true
			},
			customerAddress: {
				type: String,
				trim: true,
				required: true
			},
			vendor: {
				type: mongoose.SchemaTypes.ObjectId,
				ref: 'User',
				trim: true,
				required: true
			},
			orderLines: [
				{
					sku: {
						type: String,
						required: true
					},
					name: {
						type: String,
						trim: true,
						required: true
					},
					price: {
						type: String,
						trim: true,
						required: true
					},
					quantity: {
						type: String,
						trim: true,
						required: true
					}
				}
			],
			deliveryDate: {
				type: Date
			},
			cancelReason: {
				type: String,
				trim: true
			},
			status: { 
				type: String, 
				enum: ['Pending', 'Canceled', 'Delivered'],
				required: true
			}
		},
		{ timestamps: true }
	);
	schema.index(
		{
			orderNumber: 'text', 
			customerName: 'text', 
			customerAddress: 'text', 
			vendor: 'text', 
			deliveryDate: 'text', 
			cancelReason: 'text',
			status: 'text', 
			'orderLines.sku': 'text', 
			'orderLines.name': 'text', 
			'orderLines.price': 'text'
		},
		{ 
			weights: {
				orderNumber: 4, 
				customerName: 4, 
				customerAddress: 4, 
				cancelReason: 3,
				vendor: 5
			},
			name: "OrderTextIndex"
		}
	);

	schema.method("toJSON", function () {
		const { __v, _id, ...object } = this.toObject();
		object.id = _id;
		return object;
	});

	const Order = mongoose.model("order", schema);
	return Order;
};
