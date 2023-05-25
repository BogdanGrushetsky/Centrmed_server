const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'uploads/doctor')
	},
	filename: function (req, file, cb) {
		const ext = path.extname(file.originalname);
		cb(null, file.fieldname + '-' + Date.now() + ext);
	}
});
const uploadDoctor = multer({ storage: storage });

module.exports = uploadDoctor