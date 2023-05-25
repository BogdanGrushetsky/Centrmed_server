const UserModel = require('../models/user-model');
const ApiError = require('../exceptions/api-error');
const path = require('path');
const tokenService = require('./token-service');
const DoctorModel = require('../models/doctor-model');
const fs = require('fs');


class FilesService {
	async downloadAvatarUser(refreshToken, file) {
		const { email } = tokenService.validateRefreshToken(refreshToken);
		if (!file) {
			throw ApiError.NotHaveData();
		}
		const user = await UserModel.findOne({ email });
		if (user.avatar) {
			fs.unlink(doctor.avatar.path, (err) => {
				if (err) {
					console.error(err);
					return;
				}

				console.log('Файл успешно удален');
			});
		}
		const imageUrl = path.join(__dirname, '..', file.path)
		user.avatar = { path: imageUrl, url: `${process.env.API_URL}/uploads/user/avatar/${file.filename}` }
		user.save();
		return user
	}
	async downloadAvatarDoctor(refreshToken, file) {
		const { email } = tokenService.validateRefreshToken(refreshToken);
		if (!file) {
			throw ApiError.NotHaveData();
		}
		const doctor = await DoctorModel.findOne({ email });
		if (doctor.avatar) {
			fs.unlink(doctor.avatar, (err) => {
				if (err) {
					console.error(err);
					return;
				}

				console.log('Файл успешно удален');
			});
		}
		const imageUrl = path.join(__dirname, '..', file.path)
		doctor.avatar = { path: imageUrl, url: `${process.env.API_URL}/uploads/doctor/avatar/${file.filename}` }
		doctor.save();
		return doctor
	}

	async downloadDocumentDoctor(refreshToken, files) {
		const { email } = tokenService.validateRefreshToken(refreshToken);
		if (!files) {
			throw ApiError.NotHaveData();
		}
		const doctor = await DoctorModel.findOne({ email });
		if (doctor.pathFile.length > 0) {
			doctor.pathFile.forEach(file => {
				fs.unlink(file, (err) => {
					if (err) {
						console.error(err);
						return;
					}

					console.log('Файлы успешно удален');
				});
			})
			doctor.pathFile = []
		}
		files.map(el => {
			const filePath = path.join(__dirname, '..', el.path)
			doctor.pathFile.push({ path: filePath, url: `${process.env.API_URL}/uploads/doctor/${el.filename}` })
		})
		await doctor.save();
		return { sucsess: 'sucsess' }
	}

	async getFileDoctor(id) {
		const doctor = await DoctorModel.findById(id)
		const array = doctor.pathFile.map(el => el.url)
		return array
	}

	async dellFile(id, name) {
		const doctor = await DoctorModel.findById(id)
		const file = doctor.pathFile.filter(el => el.url === name)
		doctor.pathFile = doctor.pathFile.filter(el => el.url !== name)
		console.log(file)
		fs.unlink(file[0].path, (err) => {
			if (err) {
				console.error(err);
				return;
			}

			console.log('Файлы успешно удален');
		});
		await doctor.save()

	}
	async deleteAllFileDoctor(id) {
		const doctor = await DoctorModel.findById(id)
		await doctor.pathFile.map(el =>
			fs.unlink(el.path, (err) => {
				if (err) {
					console.error(err);
					return;
				}

				console.log('Файл успешно удален');
			}))
		return true
	}

	async AdminDownloadDocumentDoctor(id, files) {
		const doctor = await DoctorModel.findById(id)
		files.map(el => {
			const filePath = path.join(__dirname, '..', el.path)
			doctor.pathFile.push({ path: filePath, url: `${process.env.API_URL}/uploads/doctor/${el.filename}` })
		})
		await doctor.save();
		return { sucsess: 'sucsess' }
	}

}




module.exports = new FilesService();
