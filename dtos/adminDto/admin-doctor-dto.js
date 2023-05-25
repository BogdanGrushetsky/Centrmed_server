module.exports = class AdminDoctorDto {
	email;
	id;
	name;
	verified;
	constructor(model) {
		this.email = model.email;
		this.id = model._id;
		this.name = model.name;
		this.scenario = model.scenario;
		this.verified = model.verified
	}
};