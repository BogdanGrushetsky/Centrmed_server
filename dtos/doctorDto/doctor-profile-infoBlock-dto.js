module.exports = class DoctorProfileInfoBlockDto {
	id;
	name
	rate
	country
	city
	region
	consultationPrice
	constructor(model) {
		this.id = model._id;
		this.rate = model.rate;
		this.name = model.name;
		this.consultationPrice = model.consultationPrice
		this.country = model.doctorInfo.Residence.country
		this.city = model.doctorInfo.Residence.city
		this.region = model.doctorInfo.Residence.region
	}
};
