const reviewService = require('../service/review-service');





class RevieController {

	async createRevie(req, res, next) {
		try {
			const { description, from, whose, rate, feedback } = req.body;
			const resultat = await reviewService.createRevie(from, whose, rate, feedback, description)
			return res.json(resultat)
		} catch (error) {
			next(error)
		}
	}

	async getReview(req, res, next) {
		try {
			const { id } = req.params
			const resultat = await reviewService.getReview(id)
			return res.json({ reviews: resultat })
		} catch (error) {
			next(error)
		}
	}

	async deleteReview(req, res, next) {
		try {
			const { id } = req.params
			const resultat = await reviewService.deleteReview(id)
			return res.json(resultat)
		} catch (error) {
			next(error)
		}
	}
}

module.exports = new RevieController();