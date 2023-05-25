module.exports = class AdminDoctorFullInfoDto {
	email;
	id;
	verified;
	name
	scenario
	specialist
	doctorInfo
	pathFile
	rate
	consultationPrice
	getFile(path) {
		return path.map(el => el.url)
	}
	constructor(model, specialist) {
		this.email = model.email;
		this.rate = model.rate;
		this.id = model._id;
		this.verified = model.verified;
		this.name = model.name;
		this.scenario = model.scenario;
		this.specialist = specialist
		this.consultationPrice = model.consultationPrice
		this.doctorInfo = model.doctorInfo
		this.pathFile = this.getFile(model.pathFile)
	}
};