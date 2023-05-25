const userService = require('../service/user-service');
const { validationResult } = require('express-validator');
const ApiError = require('../exceptions/api-error');
const validationFunction = require('../helper/validationFunction');

class UserController {
  async registration(req, res, next) {
    try {
      validationFunction(req)
      const { email, password } = req.body;
      const userData = await userService.registration(email, password);
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async login(req, res, next) {
    try {
      validationFunction(req)
      const { email, password } = req.body;
      const userData = await userService.login(email, password);
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const token = await userService.logout(refreshToken);
      res.clearCookie('refreshToken');
      return res.json(token);
    } catch (e) {
      next(e);
    }
  }

  async activate(req, res, next) {
    try {
      const activationLink = req.params.link;
      await userService.activate(activationLink);
      return res.redirect(process.env.CLIENT_URL);
    } catch (e) {
      next(e);
    }
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const userData = await userService.refresh(refreshToken);
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      console.log(userData)
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }
  async refreshPassword(req, res, next) {
    try {
      const { oldPassword, newPassword } = req.body
      const userData = await userService.refreshPassword(req.user, oldPassword, newPassword)
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async getUsers(req, res, next) {
    try {
      const users = await userService.getAllUsers();
      return res.json(users);
    } catch (e) {
      next(e);
    }
  }
  async getInfoUser(req, res, next) {
    try {
      const user = await userService.getUserInfo(req.user)
      return res.json(user)
    } catch (e) {
      next(e)
    }
  }
  async setOrUpdateInfoUser(req, res, next) {
    try {
      validationFunction(req)
      const { refreshToken } = req.cookies;
      const userInfo = await userService.setOrUpdateInfoUser(refreshToken, req.body, req.user)
      return res.json(userInfo)

    } catch (e) {
      next(e)
    }
  }

}

module.exports = new UserController();
