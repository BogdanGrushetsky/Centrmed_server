module.exports = class UserDoctorDto {
	country;
	region;
	name;
	rate;
	specialist
	id
	rate
	city
	constructor(model) {
		this.country = model.doctorInfo.Residence.country;
		this.region = model.doctorInfo.Residence.region;
		this.city = model.doctorInfo.Residence.city;
		this.rate = model.rate;
		this.id = model._id;
		this.name = model.name;
		this.rate = model.rate;
		this.mainSpecialist = model.mainSpecialist?.specialist;
		if (model?.specialist) {
			this.specialist = model?.specialist?.map(el => el.specialist);
		}
	}
};
