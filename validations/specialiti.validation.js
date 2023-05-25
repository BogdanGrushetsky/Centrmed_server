const { body } = require('express-validator');

const specialistValidation = [
	body('specialist').isLength({ min: 2, max: 100 })
]

module.exports = { specialistValidation }