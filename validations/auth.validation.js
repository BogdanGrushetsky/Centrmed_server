const { body } = require('express-validator');

const authValidation = [
	body('email').isEmail(),
	body('password').isLength({ min: 5, max: 60 })
]

module.exports = { authValidation }