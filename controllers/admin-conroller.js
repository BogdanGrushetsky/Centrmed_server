const validationFunction = require('../helper/validationFunction');
const AdminService = require('../service/admin-service');
const filesService = require('../service/files-service');


class AdminController {

	async getPageUsers(req, res, next) {
		try {
			const page = req.query.page || 1;
			const limit = parseInt(req.query.limit) || 10;
			const serchWord = req.query.serchWord || ''
			const users = await AdminService.getPageUsers(page, limit, serchWord)
			return res.json(users)

		} catch (error) {
			next(error)
		}
	}
	async getPageDoctors(req, res, next) {
		try {
			const page = req.query.page || 1;
			const limit = parseInt(req.query.limit) || 10;
			const serchWord = req.query.serchWord || ''
			const doctors = await AdminService.getPageDoctors(page, limit, serchWord)
			return res.json(doctors)

		} catch (error) {
			next(error)
		}
	}
	async getRecentlyModifiedDoctors(req, res, next) {
		try {
			const page = req.query.page || 1;
			const limit = parseInt(req.query.limit) || 10;
			const serchWord = req.query.serchWord || ''
			const doctors = await AdminService.getRecentlyModifiedDoctors(page, limit, serchWord)
			return res.json(doctors)

		} catch (error) {
			next(error)
		}
	}
	async getRecentlyModifiedUsers(req, res, next) {
		try {
			const page = req.query.page || 1;
			const limit = parseInt(req.query.limit) || 10;
			const serchWord = req.query.serchWord || ''
			const users = await AdminService.getRecentlyModifiedUsers(page, limit, serchWord)
			return res.json(users)

		} catch (error) {
			next(error)
		}
	}
	async findSpecialist(req, res, next) {
		try {
			const page = req.query.page || 1;
			const limit = parseInt(req.query.limit) || 18;
			const serchWord = req.query.serchWord || ''
			const specialists = await AdminService.findSpecialist(page, limit, serchWord)
			return res.json(specialists)
		} catch (error) {
			next(error)
		}
	}

	async getDoctor(req, res, next) {
		try {
			const id = req.params.id
			const doctor = await AdminService.getDoctor(id)
			return res.json(doctor)

		} catch (error) {
			next(error)
		}
	}
	async getUser(req, res, next) {
		try {
			const id = req.params.id
			const user = await AdminService.getUser(id)
			return res.json(user)

		} catch (error) {
			next(error)
		}
	}


	async updateInfoDoctor(req, res, next) {
		try {
			validationFunction(req)
			const id = req.params.id
			const doctor = await AdminService.updateInfoDoctor(id, req.body)
			return res.json(doctor)
		} catch (error) {
			next(error)
		}
	}


	async updateInfoUser(req, res, next) {
		try {
			validationFunction(req)
			const id = req.params.id
			const user = await AdminService.updateInfoUser(id, req.body)
			return res.json(user)

		} catch (error) {
			next(error)
		}
	}


	async deleteUser(req, res, next) {
		try {
			try {
				const id = req.params.id
				const user = await AdminService.deleteUser(id)
				return res.json({ "sucsess": user.name + ' Delete' })

			} catch (error) {
				next(error)
			}

		} catch (error) {
			next(error)
		}
	}


	async deleteDoctor(req, res, next) {
		try {
			try {
				const id = req.params.id
				const statusDellFile = await filesService.deleteAllFileDoctor(id)
				if (!statusDellFile) {
					return res.status(404).json({ error: 'error' })
				}
				const doctor = await AdminService.deleteDoctor(id)
				return res.json({ "sucsess": doctor.name + ' Delete' })

			} catch (error) {
				next(error)
			}


		} catch (error) {
			next(error)
		}
	}

	async searchDoctor(req, res, next) {
		try {
			const doctor = await AdminService.searchDoctor(req.query.doctor)
			return res.json(doctor)
		} catch (error) {
			next(error)
		}
	}
	async searchUser(req, res, next) {
		try {
			const user = await AdminService.searchUser(req.query.user)
			return res.json(user)
		} catch (error) {
			next(error)
		}
	}


}
module.exports = new AdminController();