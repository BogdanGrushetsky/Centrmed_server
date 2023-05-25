const GetAvatarService = require('../service/get-avatar-service');

class GetAvatarController {

	async getAvatarUser(req, res, next) {
		try {
			const { id } = req.params
			const url = await GetAvatarService.getAvatar(id)

			if (!url) {

				return res.json(`${process.env.API_URL}/uploads/user/avatar/doctor.png`)
			}

			return res.json(url.url)
		} catch (error) {
			next(error)
		}
	}
}



module.exports = new GetAvatarController();