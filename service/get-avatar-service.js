const UserModel = require('../models/user-model');
const DoctorModel = require('../models/doctor-model');
const ApiError = require('../exceptions/api-error');
class getAvatarService {
	async getAvatar(id) {
		try {
			const user = await UserModel.findById(id)
			if (!user) {
				const doc = await DoctorModel.findById(id)
				const urlAvatar = doc.avatar
				if (!urlAvatar) {
					return false
				}
				return urlAvatar
			} else {
				const urlAvatar = user.avatar
				if (!urlAvatar) {
					return false
				}
				return urlAvatar
			}


		} catch (error) {
			throw ApiError.CrashFile()
		}
	}

	// async deleteIndataBase(id) {
	// 	try {
	// 		const user = await UserModel.findById(id)
	// 		if (!user) {
	// 			const doc = await DoctorModel.findById(id)
	// 			doc.avatar = undefined
	// 			await doc.save()
	// 			return doc
	// 		} else {
	// 			user.avatar = undefined
	// 			await user.save()
	// 			return user
	// 		}

	// 	} catch (error) {
	// 		throw ApiError.CrashFile()
	// 	}
	// }
}




module.exports = new getAvatarService();