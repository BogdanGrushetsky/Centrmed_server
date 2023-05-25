module.exports = class UserDto {
  email;
  id;
  name
  scenario
  constructor(model) {
    this.email = model.email;
    this.id = model._id;
    this.name = model.name;
    this.scenario = model.scenario;
  }
};
