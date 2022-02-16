module.exports = mongoose => {
	var schema = mongoose.Schema(
		{
			userId: {
				type: String,
				trim: true,
				required: true
			},
			start: {
				type: Date,
				trim: true,
				required: true
			},
			end: {
				type: Date,
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

	schema.method("toJSON", function () {
		const { __v, _id, ...object } = this.toObject();
		object.id = _id;
		return object;
	});

	const Session = mongoose.model("session", schema);
	return Session;
};
