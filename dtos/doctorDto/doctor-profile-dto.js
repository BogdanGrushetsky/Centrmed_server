module.exports = class DoctorProfileDto {
	id;
	name
	specialist
	rate
	consultationPrice
	doctorInfo
	constructor(model, specialist) {
		this.id = model._id;
		this.rate = model.rate;
		this.name = model.name;
		if (specialist) {
			this.specialist = specialist;
		}
		this.doctorInfo = model.doctorInfo
		this.consultationPrice = model.consultationPrice
	}
};
