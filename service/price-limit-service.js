const PriceLimitModel = require('../models/price-limit-model');


class PriceLimitService {
	async chengePrice(from, to) {
		const limit = await PriceLimitModel.find()
		console.log(limit)
		if (limit.length === 0 || !limit) {
			const limitCreate = await PriceLimitModel.create({ from, to })
			return limitCreate
		}
		Object.assign(limit[0], { from, to })
		await limit[0].save()
		return { Sucsess: 'Sucsess' }
	}

	async getPriceLimit() {
		const limit = await PriceLimitModel.find()
		return { from: limit[0].from, to: limit[0].to }
	}
}


module.exports = new PriceLimitService();