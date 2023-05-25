module.exports = class AdminFilterUserDto {
	email;
	id;
	name;
	scenario;
	updatedAt
	setDate(dates) {
		const date = new Date(dates)
		return date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes()
	}
	constructor(model) {
		this.email = model.email;
		this.id = model._id;
		this.name = model.name;
		this.scenario = model.scenario;
		this.updatedAt = this.setDate(model.updatedAt);
	}
};