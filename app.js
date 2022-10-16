const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
// const auth = require('./middlewares/auth');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const NotFoundError = require('./errors/NotFoundError');
const errorsHandler = require('./middlewares/errorrsHandler');

const { PORT = 3000 } = process.env;

const app = express();
app.use(cors());

app.use(helmet());
app.disable('x-powered-by');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb');

// app.use(auth);

// работа с данными пользователя
app.use('/', usersRouter);
// работа с карточками
app.use('/', cardsRouter);

app.all('*', (_req, _res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

app.use(errorsHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
