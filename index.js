require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const https = require('https');
const fs = require('fs');
const mongoose = require('mongoose');
const router = require('./router/index');
const errorMiddleware = require('./middlewares/error-middleware');

const PORT = process.env.PORT || 9000;
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
);
app.use('/uploads/doctor', express.static('uploads/doctor'));
app.use('/uploads/doctor/avatar', express.static('uploads/doctor/avatar'));
app.use('/uploads/user/avatar', express.static('uploads/user/avatar'));
app.use('/api', router);
app.use(errorMiddleware);

const options = {
  key: fs.readFileSync('/path/to/private/key.pem'),
  cert: fs.readFileSync('/path/to/certificate.pem'),
};

const start = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    https.createServer(options, app);
    app.listen(PORT, () => console.log(`Server started on PORT = ${PORT}`));
  } catch (e) {
    console.log(e);
  }
};

start();
module.exports = { start, app };
