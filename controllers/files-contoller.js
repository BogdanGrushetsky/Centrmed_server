const FilesService = require('../service/files-service');
const fs = require('fs')
class FilesController {
	async downloadAvatarUser(req, res, next) {
		try {
			const { refreshToken } = req.cookies;
			const { file } = req;
			const user = await FilesService.downloadAvatarUser(refreshToken, file)
			return res.json(user)
		} catch (error) {
			next(error)
		}
	}
	async downloadAvatarDoctor(req, res, next) {
		try {
			const { refreshToken } = req.cookies;
			const { file } = req;
			const user = await FilesService.downloadAvatarDoctor(refreshToken, file)
			return res.json(user)
		} catch (error) {
			next(error)
		}
	}

	async downloadDocumentDoctor(req, res, next) {
		try {
			const { refreshToken } = req.cookies;
			const { files } = req;
			const user = await FilesService.downloadDocumentDoctor(refreshToken, files)
			return res.json(user)

		} catch (error) {
			next(error)
		}
	}

	async getFileDoctor(req, res, next) {
		try {
			const id = req.params.id

			const files = await FilesService.getFileDoctor(id);
			console.log(files)
			return res.json(files)
		} catch (error) {
			next(error)
		}

	}
	async dellFile(req, res, next) {
		try {
			const id = req.params.id
			const { path } = req.body
			const result = await FilesService.dellFile(id, path)
			return res.json(result)
		} catch (error) {
			next(error)
		}
	}
	async AdminDownloadDocumentDoctor(req, res, next) {
		try {
			const id = req.params.id
			const { files } = req;
			const user = await FilesService.AdminDownloadDocumentDoctor(id, files)
			return res.json(user)

		} catch (error) {
			next(error)
		}
	}
}
module.exports = new FilesController();