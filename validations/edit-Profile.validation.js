const { body } = require('express-validator');

const updateUserValidation = [
	body('email').optional(),
	body('name').optional().isLength({ max: 60 }),
	body('userInfo.dateOfBirth').optional().isLength({ max: 9 }),
	body('userInfo.phoneNumber').optional().isLength({ max: 13 }),
	body('userInfo.Residence.country').optional().isLength({ max: 20 }),
	body('userInfo.Residence.region').optional().isLength({ max: 40 }),
	body('userInfo.Residence.city').optional().isLength({ max: 30 }),
]
const updateDoctorValidation = [
	body('email').optional().isEmail(),
	body('name').optional().isLength({ min: 1, max: 60 }),
	body('specialist').optional(),
	body('consultationPrice').optional().isLength({ max: 10 }),
	body('doctorInfo.acceptsInClinics').optional().isLength({ min: 2, max: 150 }),
	body('doctorInfo.workExperience').optional().isLength({ max: 4 }),
	body('doctorInfo.study').optional().isLength({ max: 100 }),
	body('doctorInfo.study').optional().isLength({ max: 100 }),
	body('doctorInfo.dateOfBirth').optional().isLength({ max: 12 }),
	body('doctorInfo.phoneNumber').optional().isLength({ max: 13 }),
	body('doctorInfo.bio').optional().isLength({ max: 1000 }),
	body('doctorInfo.Residence.country').optional().isLength({ max: 20 }),
	body('doctorInfo.Residence.region').optional().isLength({ max: 40 }),
	body('doctorInfo.Residence.city').optional().isLength({ max: 30 }),

]
module.exports = { updateUserValidation, updateDoctorValidation }