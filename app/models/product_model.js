module.exports = mongoose => {
	var schema = mongoose.Schema(
		{
			sku: {
				type: String,
				required: true,
				unique: true
			},
			name: {
				type: String,
				trim: true,
				required: true
			},
			brand: {
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
			},
			vendor: {
				type: mongoose.SchemaTypes.ObjectId,
				ref: 'User',
				trim: true,
				required: true
			},
			status: {
				type: String,
				enum: ['Active', 'Inactive'],
				required: true
			}
		},
		{ timestamps: true }
	);

	schema.index(
		{
			sku: 'text', 
			name: 'text',
			brand: 'text',
			quantity: 'text',
			vendor: 'text',
			status: 'text'
		},
		{
			weights: {
				sku: 4, 
				name: 4, 
				brand: 2, 
				vendor: 5,
				status: 5
			},
			name: "ProductTextIndex"
		}
	);
	schema.method("toJSON", function () {
		const { __v, _id, ...object } = this.toObject();
		object.id = _id;
		return object;
	});

	const Product = mongoose.model("product", schema);
	return Product;
};
