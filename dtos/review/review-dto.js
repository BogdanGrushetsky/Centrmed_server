module.exports = class ReviewDto {
	country;
	region;
	name;
	rate
	feedback
	description
	id
	constructor(model, author) {
		this.country = author.userInfo.Residence.country;
		this.region = author.userInfo.Residence.region;
		this.rate = model.rate;
		this.id = model._id;
		this.name = author.name;
		this.feedback = model.feedback;
		this.description = model.description
	}
};
