const DoctorDto = require('./doctor-dto');
module.exports = class UserInfoDto extends DoctorDto {
	doctorInfo
	pathFile
	consultationPrice
	getFile(path) {
		return path.map(el => el.url)
	}
	constructor(model, specialist) {
		super(model, specialist)
		this.doctorInfo = model.doctorInfo
		this.consultationPrice = model.consultationPrice
		this.pathFile = this.getFile(model.pathFile)
	}
};