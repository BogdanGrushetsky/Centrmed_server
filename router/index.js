const Router = require('express').Router;
const userController = require('../controllers/user-controller');
const DoctorController = require('../controllers/doctor-contoller');
const router = new Router();
const authMiddleware = require('../middlewares/auth-middleware');
const upload = require('../multer/multer');
const uploadUserAvatar = require('../multer/user-avatar-multer');
const uploadDoctorAvatar = require('../multer/doctor-avatar-multer');
const uploadDoctor = require('../multer/multer-doctor');
const specialistContoller = require('../controllers/specialist-contoller');
const AdminContoller = require('../controllers/admin-conroller');
const getAvatarController = require('../controllers/get-avatar-controller');
const FilesController = require('../controllers/files-contoller');
const priceLimitController = require('../controllers/price-limit-controller');
const reviewController = require('../controllers/review-contoller');
const interactionDoctorUserController = require('../controllers/interaction-doctor-user-controller');
const { authValidation } = require('../validations/auth.validation');
const {
  updateUserValidation,
  updateDoctorValidation,
} = require('../validations/edit-Profile.validation');
const { specialistValidation } = require('../validations/specialiti.validation');

router.post('/registration', authValidation, userController.registration);
router.post('/login', authValidation, userController.login);
router.post('/logout', userController.logout);
router.get('/activate/:link', userController.activate);
router.get('/refresh', userController.refresh);

router.post(
  '/user/refresh/password',
  authMiddleware,
  userController.refreshPassword
);
router.get('/user', authMiddleware, userController.getInfoUser);
router.post(
  '/user/info',
  authMiddleware,
  updateUserValidation,
  userController.setOrUpdateInfoUser
);
router.post(
  '/user/myDoctor/:id',
  authMiddleware,
  interactionDoctorUserController.addUserDoctor
);
router.get(
  '/user/myDoctor',
  authMiddleware,
  interactionDoctorUserController.getUserDoctor
);
router.delete(
  '/user/myDoctor/:id',
  authMiddleware,
  interactionDoctorUserController.deleteUserDoctor
);

router.get('/user/serchDoctor', interactionDoctorUserController.serchDoctors);

router.get('/users', userController.getUsers);

router.post(
  '/doctorApi/registration',
  authValidation,
  DoctorController.registration
);
router.post('/doctorApi/login', authValidation, DoctorController.login);
router.post('/doctorApi/logout', DoctorController.logout);
router.get('/doctorApi/activate/:link', DoctorController.activate);
router.get('/doctorApi/refresh', DoctorController.refresh);

router.post(
  '/doctorApi/refresh/password',
  authMiddleware,
  DoctorController.refreshPassword
);
router.get('/doctorApi/doctors', DoctorController.getDoctors);
router.get(
  '/doctorApi/doctor',
  authMiddleware,
  DoctorController.getDoctorInfo
);
router.post(
  '/doctorApi/doctor/info',
  authMiddleware,
  updateDoctorValidation,
  DoctorController.setOrUpdateInfoDoctor
);
router.get('/doctorApi/:id', DoctorController.getProfileDoctor);

router.get('/avatar/:id', getAvatarController.getAvatarUser);

router.post(
  '/files/avatar/user',
  authMiddleware,
  uploadUserAvatar.single('files'),
  FilesController.downloadAvatarUser
);
router.post(
  '/files/avatar/doctor',
  authMiddleware,
  uploadDoctorAvatar.single('files'),
  FilesController.downloadAvatarDoctor
);
router.post(
  '/files/documents/doctor',
  authMiddleware,
  uploadDoctor.array('files', 10),
  FilesController.downloadDocumentDoctor
);

router.get('/adminApi/users', AdminContoller.getPageUsers);
router.get('/adminApi/specialist', AdminContoller.findSpecialist);
router.get(
  '/adminApi/recentlyModifiedDoctors',
  AdminContoller.getRecentlyModifiedDoctors
);
router.get(
  '/adminApi/recentlyModifiedUsers',
  AdminContoller.getRecentlyModifiedUsers
);
router.get('/adminApi/doctors', AdminContoller.getPageDoctors);
router.get('/adminApi/user/:id', AdminContoller.getUser);
router.get('/adminApi/doctor/:id', AdminContoller.getDoctor);
router.delete('/adminApi/doctor/delete/:id', AdminContoller.deleteDoctor);
router.delete(
  '/adminApi/user/delete/:id',
  updateUserValidation,
  AdminContoller.deleteUser
);
router.patch(
  '/adminApi/edit/doctor/:id',
  updateDoctorValidation,
  AdminContoller.updateInfoDoctor
);
router.patch('/adminApi/edit/user/:id', AdminContoller.updateInfoUser);
router.get('/adminApi/serch/doctor/', AdminContoller.searchDoctor);
router.get('/adminApi/serch/user/', AdminContoller.searchUser);
router.get('/files/documents/doctor/:id', FilesController.getFileDoctor);
router.post('/files/delete/doctor/:id', FilesController.dellFile);
router.post(
  '/adminApi/files/documents/doctor/:id',
  uploadDoctor.array('files', 10),
  FilesController.AdminDownloadDocumentDoctor
);
router.patch('/specialist/update', specialistValidation, specialistContoller.updateSpecialist);
router.post('/specialist/create', specialistValidation, specialistContoller.createSpecialist);
router.delete('/specialist/delete/:id', specialistContoller.deleteSpecialist);

router.patch('/adminApi/PriceLimit', priceLimitController.chengePrice);
router.get('/adminApi/PriceLimit', priceLimitController.getPriceLimit);

router.post('/review/create', reviewController.createRevie);
router.get('/review/:id', reviewController.getReview);
router.delete('/review/:id', reviewController.deleteReview);

router.get('/specialist', specialistContoller.findAllSpecialist);

module.exports = router;
