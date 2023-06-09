require('dotenv').config();
const https = require('https');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
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

const start = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const options = {
      key: fs.readFileSync(
        '/var/www/clients/client1/web2/ssl/centrmed.ua-le.key'
      ),
      cert: fs.readFileSync(
        '/var/www/clients/client1/web2/ssl/centrmed.ua-le.crt'
      ),
    };

    const server = https.createServer(options, app);

    server.listen(PORT, () => {
      console.log(`Server started on PORT = ${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
};

start();
module.exports = { start, app };
