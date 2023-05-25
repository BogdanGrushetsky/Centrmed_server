const UserDto = require('./user-dto');
module.exports = class UserInfoDto extends UserDto {
	userInfo
	constructor(model) {
		super(model)
		this.userInfo = model.userInfo
	}
};