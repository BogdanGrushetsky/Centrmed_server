
const interactionDoctorUserService = require('../service/interaction-doctor-user-service');

class InteractionDoctorUser {

	async addUserDoctor(req, res, next) {
		try {
			const { id } = req.params
			const userData = req.user
			const status = await interactionDoctorUserService.addUserDoctor(userData, id)
			return res.json(status)
		} catch (error) {
			next(error)
		}
	}
	async getUserDoctor(req, res, next) {
		try {
			const userData = req.user.id
			const data = await interactionDoctorUserService.getUserDoctor(userData)
			return res.json({ doctors: data })
		} catch (error) {
			next(error)
		}
	}
	async deleteUserDoctor(req, res, next) {
		try {
			const { id } = req.params
			const userData = req.user.id
			const status = await interactionDoctorUserService.deleteUserDoctor(userData, id)
			return res.json(status)
		} catch (error) {
			next(error)
		}
	}
	async serchDoctors(req, res, next) {
		try {
			const page = req.query.page || 1;
			const limit = parseInt(req.query.limit) || 10;
			const serchWord = req.query.serchWord || ''
			const idSpecialist = req.query.specialist
			const region = req.query.region
			const city = req.query.city
			const doctors = await interactionDoctorUserService.serchDoctors(page, limit, serchWord, idSpecialist, region, city)
			return res.json(doctors)
		} catch (error) {
			next(error)
		}
	}
}



module.exports = new InteractionDoctorUser();