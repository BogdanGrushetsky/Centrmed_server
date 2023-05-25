const { Schema, model } = require('mongoose');
const Specialist = require('./specialist-model')


const DoctorSchema = new Schema({
	email: { type: String, unique: true, required: true },
	password: { type: String, required: true },
	isActivated: { type: Boolean, default: true },
	activationLink: { type: String },
	name: { type: String, required: true, default: 'Лікар' },
	avatar: { type: Object },
	scenario: { type: String, default: 'doctor' },
	mainSpecialist: { type: Schema.Types.ObjectId, ref: 'Specialist' },
	specialist: [{ type: Schema.Types.ObjectId, ref: 'Specialist' }],
	rate: { type: Number },
	doctorInfo: {
		workExperience: { type: Number },
		acceptsInClinics: { type: String },
		study: { type: String },
		dateOfBirth: { type: String },
		phoneNumber: { type: Number },
		bio: { type: String },
		curdNumber: { type: Number },
		Residence: {
			country: { type: String, default: 'Україна' },
			region: { type: String },
			city: { type: String },
		}
	},
	consultationPrice: { type: Number },
	pathFile: [Object],
	verified: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = model('Doctor', DoctorSchema);
