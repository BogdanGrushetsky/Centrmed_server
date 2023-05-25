const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  isActivated: { type: Boolean, default: true },
  activationLink: { type: String },
  name: { type: String, required: true, default: 'Користувач' },
  avatar: { type: Object },
  scenario: { type: String, default: 'patient' },
  userInfo: {
    dateOfBirth: { type: String },
    height: { type: String },
    phoneNumber: { type: Number },
    weight: { type: Number },
    complaints: { type: String },
    allergies: { type: String },
    curdNumber: { type: Number },
    Residence: {
      country: { type: String, default: 'Україна' },
      region: { type: String },
      city: { type: String },
    },
  },
  pathFile: [Object],
  myDoctors: [{ type: Schema.Types.ObjectId, ref: 'Doctor' }]
}, { timestamps: true });

module.exports = model('User', UserSchema);
