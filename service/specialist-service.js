
const specialistModel = require('../models/specialist-model');
const ApiError = require('../exceptions/api-error');
const SpecialistDto = require('../dtos/specialistDto/specialist-dto');
const doctorModel = require('../models/doctor-model');

class SpecialistService {

	async createSpecialist(specialist) {
		await findSpecialistHelper(specialist, true)
		const data = await specialistModel.create({ specialist })
		return { specialist: new SpecialistDto(data) }
	}


	async finAllSpecialist() {
		const specialist = await specialistModel.find()
		const array = specialist.map(el => new SpecialistDto(el))
		return { specialists: array }
	}


	async deletSpecialist(_id) {
		await doctorModel.updateMany({ specialist: _id }, { $pull: { specialist: _id } })
		await doctorModel.updateMany({ mainSpecialist: _id }, { $pull: { mainSpecialist: _id } })
		await specialistModel.deleteOne({ _id })
		return
	}


	async updateSpecialist(id, newName) {
		const specialist = await specialistModel.findOneAndUpdate({ _id: id }, { specialist: newName })
		return specialist
	}
}

module.exports = new SpecialistService();


const findSpecialistHelper = async (specialist, specialistMustBe) => {

	const find = await specialistModel.findOne({ specialist })
	if (specialistMustBe) {
		if (find) {
			throw ApiError.AlredyOne()
		}
		return find
	} else {
		if (!find) {
			throw ApiError.NotFound()
		}
		return find
	}
}