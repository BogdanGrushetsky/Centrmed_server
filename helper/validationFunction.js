const { validationResult } = require('express-validator');
const ApiError = require('../exceptions/api-error');

module.exports = function validationFunction(req) {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		console.log(1)
		throw ApiError.BadRequest('Помилка під час валідації', errors.array())

	}
	return true
}