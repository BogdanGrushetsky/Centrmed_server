const UserModel = require('../models/user-model');
const DoctorModel = require('../models/doctor-model');
const ApiError = require('../exceptions/api-error');
const specialistModel = require('../models/specialist-model');
const UserDoctorDto = require('../dtos/Interaction/user-doctor-dto');

class InteractionDoctorUserService {
	async addUserDoctor(userData, idDoctor) {
		const user = await UserModel.findOne({ email: userData.email })
		NotFound(user)
		const doctor = await DoctorModel.findById({ _id: idDoctor })
		NotFound(doctor)
		if (user?.myDoctors?.length === 0) {
			user.myDoctors = [doctor]
			await user.save()
			return { Sucsess: 'Sucsess' }
		}
		const haveDoctor = user.myDoctors.some(el => el == idDoctor)
		if (haveDoctor) {
			throw ApiError.AlredyOne()
		}
		user.myDoctors.push(idDoctor)
		await user.save()
		return { Sucsess: 'Sucsess' }
	}
	async getUserDoctor(id) {
		const user = await UserModel.findById(id)
		NotFound(user)
		const arrayDoctorsUser = Promise.all(user.myDoctors.map(async (el) => {
			const doctor = await DoctorModel.findById(el).populate('mainSpecialist')
			return new UserDoctorDto(doctor)
		}))
		return arrayDoctorsUser
	}
	async deleteUserDoctor(id, idDoctor) {
		const user = await UserModel.findById(id)
		NotFound(user)
		const newArrayMyDoctor = user.myDoctors.filter(el => el != idDoctor)
		user.myDoctors = newArrayMyDoctor
		await user.save()
		return { Sucsess: 'Sucsess' }
	}
	async serchDoctors(page, limit, serchWord, idSpecialist, region, city) {

		const serchAtribut = {
			verified: true,
			name: { $regex: serchWord, $options: 'i' },
		}
		if (idSpecialist) serchAtribut.specialist = idSpecialist
		if (region) serchAtribut['doctorInfo.Residence.region'] = region
		if (city) serchAtribut['doctorInfo.Residence.city'] = city
		const doctors = await DoctorModel.find(serchAtribut)
			.skip((page - 1) * limit)
			.limit(limit)
			.populate('specialist')
			.populate('mainSpecialist')
		const doctorsDto = await doctors.map(el => new UserDoctorDto(el));
		const count = await DoctorModel.countDocuments(serchAtribut)
			.skip((page - 1) * limit)
		const pageCount = Math.ceil(count / limit)
		return { doctors: doctorsDto, pageCount }
	}
}

const NotFound = (somWhone) => {
	if (!somWhone) {
		throw ApiError.NotFound()
	}
}


module.exports = new InteractionDoctorUserService();