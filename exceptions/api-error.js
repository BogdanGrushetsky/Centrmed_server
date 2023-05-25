module.exports = class ApiError extends Error {
  status;
  errors;

  constructor(status, message, errors = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  static UnauthorizedError() {
    return new ApiError(401, 'Користувач не авторизований');
  }

  static BadRequest(message, errors = []) {
    return new ApiError(400, message, errors);
  }
  static NotFound() {
    return new ApiError(404, 'Not Found');
  }
  static AlredyOne() {
    return new ApiError(409, 'Such data already exists');
  }
  static NotHaveData() {
    return new ApiError(406, 'Wrong data sent');
  }
  static CrashFile() {
    return new ApiError(406, 'Crash with file');
  }
  static ReviewАlreadyLeft() {
    return new ApiError(406, 'Review Аlready Left');
  }
};
