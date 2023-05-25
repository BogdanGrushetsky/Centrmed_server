const DoctorService = require('../service/doctor-service');
const { validationResult } = require('express-validator');
const ApiError = require('../exceptions/api-error');
const DoctorInfoDto = require('../dtos/doctorDto/doctor-info-dto');
const DoctorProfileDto = require('../dtos/doctorDto/doctor-profile-dto');
const validationFunction = require('../helper/validationFunction');

class DoctorController {
	async registration(req, res, next) {
		try {
			validationFunction(req)
			const { email, password } = req.body;
			const doctorData = await DoctorService.registration(email, password);
			res.cookie('refreshToken', doctorData.refreshToken, {
				maxAge: 30 * 24 * 60 * 60 * 1000,
				httpOnly: true,
			});
			return res.json(doctorData);
		} catch (e) {
			next(e);
		}
	}

	async login(req, res, next) {
		try {
			validationFunction(req)
			const { email, password } = req.body;
			const doctorData = await DoctorService.login(email, password);
			res.cookie('refreshToken', doctorData.refreshToken, {
				maxAge: 30 * 24 * 60 * 60 * 1000,
				httpOnly: true,
			});
			return res.json(doctorData);
		} catch (e) {
			next(e);
		}
	}

	async logout(req, res, next) {
		try {
			const { refreshToken } = req.cookies;
			const token = await DoctorService.logout(refreshToken);
			res.clearCookie('refreshToken');
			return res.json(token);
		} catch (e) {
			next(e);
		}
	}

	async activate(req, res, next) {
		try {
			const activationLink = req.params.link;
			await DoctorService.activate(activationLink);
			return res.redirect(process.env.CLIENT_URL);
		} catch (e) {
			next(e);
		}
	}

	async refresh(req, res, next) {
		try {
			const { refreshToken } = req.cookies;
			const doctorData = await DoctorService.refresh(refreshToken);
			res.cookie('refreshToken', doctorData.refreshToken, {
				maxAge: 30 * 24 * 60 * 60 * 1000,
				httpOnly: true,
			});
			return res.json(doctorData);
		} catch (e) {
			next(e);
		}
	}
	async refreshPassword(req, res, next) {
		try {
			const { oldPassword, newPassword } = req.body
			const doctorData = await DoctorService.refreshPassword(req.user, oldPassword, newPassword)
			res.cookie('refreshToken', doctorData.refreshToken, {
				maxAge: 30 * 24 * 60 * 60 * 1000,
				httpOnly: true,
			});
			return res.json(doctorData);
		} catch (e) {
			next(e);
		}
	}
	async getDoctors(req, res, next) {
		try {
			const doctor = await DoctorService.getAllDoctors();
			return res.json(doctor);
		} catch (e) {
			next(e);
		}
	}
	async getDoctorInfo(req, res, next) {
		try {
			console.log(req.user)
			const doctor = await DoctorService.getDoctorInfo(req.user.id, DoctorInfoDto)
			return res.json(doctor)
		} catch (e) {
			next(e)
		}
	}

	async getProfileDoctor(req, res, next) {
		try {
			const id = req.params.id
			const doctor = await DoctorService.getDoctorInfo(id, DoctorProfileDto)
			return res.json(doctor)
		} catch (e) {
			next(e)
		}
	}

	async setOrUpdateInfoDoctor(req, res, next) {
		try {
			validationFunction(req)
			const userInfo = await DoctorService.setOrUpdateInfoDoctor(req.user, req.body)

			return res.json(userInfo)
		} catch (e) {
			next(e)
		}
	}
}
module.exports = new DoctorController();