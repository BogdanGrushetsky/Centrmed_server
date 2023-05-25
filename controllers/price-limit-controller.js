


const PriceLimitService = require('../service/price-limit-service');

class PriceLimitController {

	async chengePrice(req, res, next) {
		try {
			const from = req.query.from
			const to = req.query.to
			const resultat = await PriceLimitService.chengePrice(from, to)
			return res.json(resultat)
		} catch (error) {
			next(error)
		}
	}

	async getPriceLimit(req, res, next) {
		try {
			const resultat = await PriceLimitService.getPriceLimit()
			return res.json(resultat)
		} catch (error) {
			next(error)
		}
	}
}

module.exports = new PriceLimitController();