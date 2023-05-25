const UserModel = require('../models/user-model');
const DoctorModel = require('../models/doctor-model');
const TokenSchema = require('../models/token-model');
const ApiError = require('../exceptions/api-error');
const AdminUserDto = require('../dtos/adminDto/admin-user-dto');
const AdminUserFullInfoDto = require('../dtos/adminDto/admin-userFullInfo-dto');
const AdminDoctorDto = require('../dtos/adminDto/admin-doctor-dto');
const AdminDoctorFullInfoDto = require('../dtos/adminDto/admin-doctorFullInfo-dto');
const AdminFilterDoctorDto = require('../dtos/adminDto/admin-filter-doctor-dto');
const AdminFilterUserDto = require('../dtos/adminDto/admin-filter-user-dto');
const SpecialistDto = require('../dtos/specialistDto/specialist-dto');
const specialistModel = require('../models/specialist-model');
const removeEmptyStrings = require('../helper/helperFunction');
const bcrypt = require('bcrypt');
const userModel = require('../models/user-model');

class AdminService {
	async getPageUsers(page, limit, serchWord) {
		const data = await pagination(page, limit, serchWord, UserModel, true, AdminUserDto, 'name')
		return { users: data.data, pageCount: data.pageCount };
	}

	async getPageDoctors(page, limit, serchWord) {
		const data = await pagination(page, limit, serchWord, DoctorModel, false, AdminDoctorDto, 'name')
		return { doctors: data.data, pageCount: data.pageCount };
	}

	async getRecentlyModifiedDoctors(page, limit, serchWord) {
		const data = await pagination(page, limit, serchWord, DoctorModel, true, AdminFilterDoctorDto, 'name')
		return { doctors: data.data, pageCount: data.pageCount };
	}

	async getRecentlyModifiedUsers(page, limit, serchWord) {
		const data = await pagination(page, limit, serchWord, UserModel, true, AdminFilterUserDto, 'name')
		return { users: data.data, pageCount: data.pageCount };
	}

	async findSpecialist(page, limit, serchWord) {
		const data = await pagination(page, limit, serchWord, specialistModel, false, SpecialistDto, 'specialist')
		return { specialists: data.data, pageCount: data.pageCount }
	}


	async getDoctor(id) {
		const doctor = await DoctorModel.findById(id)
		if (!doctor) {
			throw ApiError.NotHaveData()
		}

		if (doctor.specialist.length !== 0) {
			const arr = await Promise.all(doctor.specialist.map(el => specialistModel.findById(el)))
			return { doctor: new AdminDoctorFullInfoDto(doctor, arr) }
		}
		const doctorData = new AdminDoctorFullInfoDto(doctor)
		return { doctor: doctorData }
	}

	async getUser(id) {
		const user = await UserModel.findById(id)
		if (!user) {
			throw ApiError.NotHaveData()
		}
		return { user: new AdminUserFullInfoDto(user) }
	}


	async updateInfoDoctor(id, doctorInfo) {
		if (doctorInfo.specialist) {
			const doctor = await DoctorModel.findById(id);
			const arr = await Promise.all(doctorInfo.specialist.map((el) => specialistModel.findById(el._id)));
			const mainSpecialist = arr[0]
			doctor.specialist = arr
			doctor.mainSpecialist = mainSpecialist
			await doctor.save()
			doctorInfo.specialist = ''
		}
		const validateInfo = removeEmptyStrings(doctorInfo)
		if (validateInfo.password) {
			const hashPassword = await bcrypt.hash(validateInfo.password, 3);
			validateInfo.password = hashPassword
		}
		const doctor = await DoctorModel.findById(id)
		if (validateInfo.doctorInfo) {
			const newDoc = Object.assign(doctor.doctorInfo, validateInfo.doctorInfo)
			validateInfo.doctorInfo = newDoc
		}
		await DoctorModel.updateOne({ _id: id }, validateInfo);
		return { Sucsess: 'Sucsess' }
	}




	async updateInfoUser(id, userInfo) {
		const validateInfo = removeEmptyStrings(userInfo)
		if (validateInfo.password) {
			const hashPassword = await bcrypt.hash(validateInfo.password, 3);
			validateInfo.password = hashPassword
		}
		const user = await userModel.findById(id)
		if (!user) {
			throw ApiError.NotHaveData()
		}
		if (validateInfo.userInfo) {
			const newDoc = Object.assign(user.userInfo, validateInfo.userInfo)
			validateInfo.userInfo = newDoc
		}
		await userModel.updateOne({ _id: id }, validateInfo);
		return { Sucsess: 'Sucsess' }
	}


	async deleteUser(id) {
		const user = await UserModel.findByIdAndDelete(id)
		if (!user) {
			throw ApiError.NotHaveData()
		}
		await TokenSchema.findOneAndDelete(id)
		return user
	}


	async deleteDoctor(id) {
		const doctor = await DoctorModel.findByIdAndDelete(id)

		if (!doctor) {
			throw ApiError.NotHaveData()
		}
		await TokenSchema.findOneAndDelete(id)
		return doctor

	}

	async searchDoctor(doctorName,) {
		const doctor = await DoctorModel.find({ name: { $regex: doctorName, $options: 'i' } })
		const array = doctor.map(el => new AdminDoctorDto(el))
		return array
	}
	async searchUser(doctorName,) {
		const user = await UserModel.find({ name: { $regex: doctorName, $options: 'i' } })
		const array = user.map(el => new AdminUserDto(el))
		return array
	}
}

const pagination = async (page, limit, serchWord, model, sort, Dto, where) => {
	const serAtribut = { [where]: { $regex: serchWord, $options: 'i' } }
	let array
	if (sort) {
		array = await model.find(serAtribut)
			.sort({ updatedAt: -1 })
			.skip((page - 1) * limit)
			.limit(limit)
	} else {
		array = await model.find(serAtribut)
			.skip((page - 1) * limit)
			.limit(limit)
	}
	const data = array.map(el => new Dto(el))
	const pageAll = await model.countDocuments().exec()
	const pageCount = Math.ceil(pageAll / 10)
	return { data, pageCount };
}


module.exports = new AdminService();