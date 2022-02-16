module.exports = mongoose => {
	var schema = mongoose.Schema(
		{
			firstName: {
				type: String,
				trim: true,
				required: true
			},
			lastName: {
				type: String,
				trim: true,
				required: true
			},
			username: {
				type: String,
				trim: true,
				required: true
			},
			password: {
				type: String,
				trim: true,
				required: true
			},
			type: {
				type: String,
				enum: ['Admin', 'Vendor'],
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

	schema.method("toJSON", function () {
		const { __v, _id, ...object } = this.toObject();
		object.id = _id;
		return object;
	});

	const User = mongoose.model("user", schema);
	return User;
};
