module.exports = class AdminUserFullInfoDto {
	email;
	_id;
	name;
	scenario;
	userInfo
	constructor(model) {
		this.email = model.email;
		this._id = model._id;
		this.name = model.name;
		this.scenario = model.scenario;
		this.userInfo = model.userInfo;
	}
};