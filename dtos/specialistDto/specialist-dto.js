module.exports = class SpecialistDto {
	specialist
	_id
	constructor(model) {
		this._id = model._id;
		this.specialist = model.specialist
	}
};
