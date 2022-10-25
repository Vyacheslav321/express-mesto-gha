const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { errors } = require('celebrate');
const router = require('./routes');
const errorsHandler = require('./middlewares/errorrsHandler');

const { PORT = 3000 } = process.env;

const app = express();
app.use(cors()); // Корс

app.use(helmet());
app.disable('x-powered-by');

app.use(cookieParser());// Парсер кук как мидлвэр
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://51.250.72.40:27017/mestodb'); // подключение сервера mongo

app.use(router); // Логика маршрутизации

app.use(errors()); // обработчик ошибок celebrate
app.use(errorsHandler);// централизованный обработчик ошибок

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
