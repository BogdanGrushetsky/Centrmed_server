const UserModel = require('../models/user-model');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mailService = require('./mail-service');
const tokenService = require('./token-service');
const UserDto = require('../dtos/userDto/user-dto');
const UserInfoDto = require('../dtos/userDto/user-info-dto');
const ApiError = require('../exceptions/api-error');
const removeEmptyStrings = require('../helper/helperFunction')

class UserService {
  async registration(email, password) {
    const candidate = await UserModel.findOne({ email });
    if (candidate) {
      throw ApiError.BadRequest(
        `Користувач із поштовою адресою ${email} вже існує`
      );
    }
    const hashPassword = await bcrypt.hash(password, 3);
    const activationLink = uuid.v4();
    const user = await UserModel.create({
      email,
      password: hashPassword,
      activationLink,
      isActivated: true
    });
    // await mailService.sendActivationMail(
    //   email,
    //   `${process.env.API_URL}/api/activate/${activationLink}`
    // );

    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  }

  async activate(activationLink) {
    const user = await UserModel.findOne({ activationLink });
    if (!user) {
      throw ApiError.BadRequest('Неправильне посилання для активації');
    }
    user.isActivated = true;
    await user.save();
  }

  async login(email, password) {
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw ApiError.BadRequest('Користувача з таким email не знайдено');
    }
    const isPassEquals = await bcrypt.compare(password, user.password);
    if (!isPassEquals) {
      throw ApiError.BadRequest('Невірний пароль');
    }
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return { ...tokens, user: userDto };
  }

  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }
    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await tokenService.findToken(refreshToken);
    if (!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError();
    }
    const user = await UserModel.findById(userData.id);
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });

    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return { ...tokens, user: userDto };
  }


  async refreshPassword(userReq, oldpassword, newpassword) {
    const { email } = userReq
    const user = await UserModel.findOne({ email });
    const isPassEquals = await bcrypt.compare(oldpassword, user.password);
    if (!isPassEquals) {
      throw ApiError.BadRequest('Невірний пароль');
    }
    const hashPassword = await bcrypt.hash(newpassword, 3);
    user.password = hashPassword
    user.save()
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return { ...tokens, user: userDto };
  }


  async getAllUsers() {
    const users = await UserModel.find();
    const array = users.map(el => new UserDto(el))
    return { users: array };
  }

  async getUserInfo(userReq) {
    const users = await UserModel.findById(userReq.id);
    return { user: users }
  }

  async setOrUpdateInfoUser(refreshToken, userInfo, userReq) {
    const validUserInfo = removeEmptyStrings(userInfo)
    const user = await UserModel.findById(userReq.id);
    if (validUserInfo.userInfo) {
      if (validUserInfo.userInfo.Residence) {
        const newResidens = Object.assign(user.userInfo.Residence, validUserInfo.userInfo.Residence)
        validUserInfo.userInfo.Residence = newResidens
      }
      const newUserDesc = Object.assign(user.userInfo, validUserInfo.userInfo)
      validUserInfo.userInfo = newUserDesc

    }
    await UserModel.updateOne({ _id: userReq.id }, validUserInfo);
    return { Sucsess: 'Suncsees' }
  }

}




module.exports = new UserService();
