require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { errors } = require('celebrate');
const router = require('./routes');
const errorsHandler = require('./middlewares/errorrsHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3001 } = process.env;

const app = express();

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://localhost:3000',
    'http://sphere.students.nomoredomains.icu',
    'https://sphere.students.nomoredomains.icu',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
}));

app.use(helmet());
app.disable('x-powered-by');

app.use(cookieParser());// Парсер кук как мидлвэр
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', { useNewUrlParser: true }); // подключение сервера mongo

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(router); // Логика маршрутизации

app.use(errorLogger);

app.use(errors()); // обработчик ошибок celebrate
app.use(errorsHandler);// централизованный обработчик ошибок

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
