module.exports = class DoctorDto {
  email;
  id;
  verified;
  name
  scenario
  specialist

  constructor(model, specialist) {
    this.email = model.email;
    this.id = model._id;
    this.verified = model.verified;
    this.name = model.name;
    this.scenario = model.scenario;
    this.specialist = specialist
  }
};
