const { Schema, model } = require('mongoose');



const SpecialistSchema = new Schema({
	specialist: { type: String, required: true },
});

module.exports = model('Specialist', SpecialistSchema);
