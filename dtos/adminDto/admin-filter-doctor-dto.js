module.exports = class AdminFilterDoctorDto {
	email;
	id;
	isActivated;
	name;
	verified;
	updatedAt
	setDate(dates) {
		const date = new Date(dates)
		return date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes()
	}
	constructor(model) {
		this.email = model.email;
		this.id = model._id;
		this.isActivated = model.isActivated;
		this.name = model.name;
		this.scenario = model.scenario;
		this.verified = model.verified;
		this.updatedAt = this.setDate(model.updatedAt);
	}
};