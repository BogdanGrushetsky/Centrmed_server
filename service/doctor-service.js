const DoctorModel = require('../models/doctor-model');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mailService = require('./mail-service');
const tokenService = require('./token-service');
const DoctorDto = require('../dtos/doctorDto/doctor-dto');
const DoctorInfoDto = require('../dtos/doctorDto/doctor-info-dto');
const ApiError = require('../exceptions/api-error');
const removeEmptyStrings = require('../helper/helperFunction');
const specialistModel = require('../models/specialist-model');
const priceLimitModel = require('../models/price-limit-model');
class DoctorService {
  async registration(email, password) {
    const candidate = await DoctorModel.findOne({ email });
    if (candidate) {
      throw ApiError.BadRequest(
        `Користувач із поштовою адресою ${email} вже існує`
      );
    }
    const hashPassword = await bcrypt.hash(password, 3);
    const activationLink = uuid.v4();
    const doctor = await DoctorModel.create({
      email,
      password: hashPassword,
      activationLink,
      isActivated: true
    });
    // await mailService.sendActivationMail(
    //   email,
    //   `${process.env.API_URL}/api/activate/${activationLink}`
    // );

    const doctroDto = new DoctorDto(doctor);
    const tokens = tokenService.generateTokens({ ...doctroDto });
    await tokenService.saveToken(doctroDto.id, tokens.refreshToken);

    return { ...tokens, doctor: doctroDto };
  }

  async activate(activationLink) {
    const doctor = await DoctorModel.findOne({ activationLink });
    if (!doctor) {
      throw ApiError.BadRequest('Неправильне посилання для активації');
    }
    doctor.isActivated = true;
    await doctor.save();
  }

  async login(email, password) {
    const doctor = await DoctorModel.findOne({ email });
    if (!doctor) {
      throw ApiError.BadRequest('Користувача з таким email не знайдено');
    }
    const isPassEquals = await bcrypt.compare(password, doctor.password);
    if (!isPassEquals) {
      throw ApiError.BadRequest('Невірний пароль');
    }
    const doctorDto = new DoctorDto(doctor);
    const tokens = tokenService.generateTokens({ ...doctorDto });

    await tokenService.saveToken(doctorDto.id, tokens.refreshToken);
    return { ...tokens, doctor: doctorDto };
  }

  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }

    const doctorData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await tokenService.findToken(refreshToken);
    if (!doctorData || !tokenFromDb) {
      throw ApiError.UnauthorizedError();
    }
    const doctor = await DoctorModel.findById(doctorData.id);
    const doctorDto = new DoctorDto(doctor);
    const tokens = tokenService.generateTokens({ ...doctorDto });

    await tokenService.saveToken(doctorDto.id, tokens.refreshToken);
    return { ...tokens, doctor: doctorDto };
  }

  async refreshPassword(doctorReq, oldpassword, newpassword) {
    const { email } = doctorReq
    const doctor = await DoctorModel.findOne({ email });
    const isPassEquals = await bcrypt.compare(oldpassword, doctor.password);
    if (!isPassEquals) {
      throw ApiError.BadRequest('Невірний пароль');
    }
    const hashPassword = await bcrypt.hash(newpassword, 3);
    doctor.password = hashPassword
    doctor.save()
    const doctorDto = new DoctorDto(doctor);
    const tokens = tokenService.generateTokens({ ...doctorDto });
    await tokenService.saveToken(doctorDto.id, tokens.refreshToken);
    return { ...tokens, doctor: doctorDto };
  }

  async getAllDoctors() {
    const doctor = await DoctorModel.find();
    const array = await Promise.all(
      doctor.map(async (el) => {
        if (el.specialist) {
          const arr = await Promise.all(el.specialist.map(async el => await specialistModel.findById(el)))
          return new DoctorInfoDto(el, arr)
        }
        return new DoctorInfoDto(el)
      })
    )
    console.log(array)
    return array;
  }


  async getDoctorInfo(id, ClassDto) {
    const doctor = await DoctorModel.findById(id);
    if (doctor?.specialist?.length) {
      const arr = await Promise.all(doctor.specialist.map(el => specialistModel.findById(el)))
      return { doctor: new ClassDto(doctor, arr) }
    }
    return { doctor: new ClassDto(doctor) }
  }

  async setOrUpdateInfoDoctor(doctorReq, doctorInfo) {
    const { email } = doctorReq
    if (doctorInfo.consultationPrice) {
      const limit = await priceLimitModel.find()
      doctorInfo.consultationPrice = doctorInfo.consultationPrice >= limit[0].from && doctorInfo.consultationPrice <= limit[0].to ? doctorInfo.consultationPrice : ''
    }
    if (doctorInfo.specialist) {
      const doctor = await DoctorModel.findOne({ email });
      const arr = await Promise.all(doctorInfo.specialist.map((el) => specialistModel.findById(el._id)));
      const mainSpecialist = arr[0]
      doctor.specialist = arr
      doctor.mainSpecialist = mainSpecialist
      await doctor.save()
      doctorInfo.specialist = ''
    }
    const validateInfo = removeEmptyStrings(doctorInfo)
    if (Object.keys(validateInfo).length === 0) {
      return { Sucsess: 'Sucsess' }
    }
    const doctor = await DoctorModel.findOne({ email })
    if (validateInfo.doctorInfo) {
      if (validateInfo.doctorInfo.Residence) {
        const newResidens = Object.assign(doctor.doctorInfo.Residence, validateInfo.doctorInfo.Residence)
        validateInfo.doctorInfo.Residence = newResidens
      }
      const newDoc = Object.assign(doctor.doctorInfo, validateInfo.doctorInfo)
      validateInfo.doctorInfo = newDoc
    }
    await DoctorModel.updateOne({ email }, validateInfo);
    return { Sucsess: 'Sucsess' }
  }
}





module.exports = new DoctorService();
