const { Schema, model } = require('mongoose');



const PriceLimitSchema = new Schema({
	from: { type: Number, required: true, default: 50 },
	to: { type: Number, required: true, default: 1000 },
});

module.exports = model('PriceLimit', PriceLimitSchema);
