const { Schema, model } = require('mongoose');


const ReviewSchema = new Schema({
	feedback: { type: Boolean, required: true },
	rate: { type: Number, required: true, min: 1, max: 5 },
	from: { type: Schema.Types.ObjectId, ref: 'User' },
	whose: { type: Schema.Types.ObjectId, ref: 'Doctor' },
	description: { type: String },
}, { timestamps: true });

module.exports = model('Review', ReviewSchema);
