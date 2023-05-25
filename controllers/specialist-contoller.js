
const validationFunction = require('../helper/validationFunction');
const specialistService = require('../service/specialist-service');


class SpecialistContoller {


	async createSpecialist(req, res, next) {
		try {
			validationFunction(req)
			const { specialist } = req.body
			const data = await specialistService.createSpecialist(specialist)
			return res.json(data)
		} catch (error) {
			next(error)
		}
	}

	async findAllSpecialist(req, res, next) {
		try {
			const data = await specialistService.finAllSpecialist()
			return res.json(data)
		} catch (error) {
			next(error)
		}
	}
	async updateSpecialist(req, res, next) {
		try {
			validationFunction(req)
			const id = req.query.id
			const newName = req.query.newName
			const updateName = await specialistService.updateSpecialist(id, newName)
			return res.json(updateName)

		} catch (error) {
			next(error)
		}
	}
	async deleteSpecialist(req, res, next) {
		try {
			const id = req.params.id
			await specialistService.deletSpecialist(id)
			return res.json({ "sucsess": ' Delete' })

		} catch (error) {
			next(error)
		}
	}
}

module.exports = new SpecialistContoller();