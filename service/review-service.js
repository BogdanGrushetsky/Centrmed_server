const ReviewModel = require('../models/review-model');
const DoctorModel = require('../models/doctor-model');
const UserModel = require('../models/user-model');
const ApiError = require('../exceptions/api-error');
const ReviewDto = require('../dtos/review/review-dto');

class ReviewService {
	async createRevie(from, whose, rate, feedback, description,) {
		const user = await UserModel.findById({ _id: from })
		if (!user) {
			throw ApiError.NotFound()
		}
		if (await ReviewModel.find({ whose, from })) {
			throw ApiError.ReviewАlreadyLeft()
		}
		await ReviewModel.create({
			from,
			whose,
			rate,
			feedback,
			description
		})
		updateRating(whose)
		return { Sucsess: 'Sucsess' }

	}
	async getReview(id) {
		const reviewsArray = await ReviewModel.find({ whose: id })
		const infoReview = await Promise.all(reviewsArray.map(async (el) => {
			const author = await UserModel.findById({ _id: el.from })
			return new ReviewDto(el, author)
		}))
		return infoReview
	}

	async deleteReview(id) {
		const review = await ReviewModel.findById(id)
		const statusDelete = await ReviewModel.deleteOne({ _id: id })
		if (statusDelete.deletedCount === 0) {
			throw ApiError.NotFound()
		}
		console.log(statusDelete)
		await updateRating(review.whose)
		return { Sucsess: 'Sucsess' }
	}
}

const updateRating = async (id) => {
	const doctor = await DoctorModel.findById(id)
	if (!doctor) {
		throw ApiError.NotFound()
	}
	const arrayRate = await ReviewModel.find({ whose: id })
	const summa = arrayRate.reduce((acc, rating) => acc + rating.rate, 0)
	const numberOfRatings = arrayRate.length;
	doctor.rate = Math.round(summa / numberOfRatings);
	await doctor.save()
}


module.exports = new ReviewService();