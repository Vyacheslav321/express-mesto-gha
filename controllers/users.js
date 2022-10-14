const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET = 'dfYSD54hvdhDSH7db5dsbDjg' } = process.env;
const NotFoundError = require('../errors/NotFoundError');
const NotValidCodeError = require('../errors/NotValidCodeError');
const NotValidJwt = require('../errors/NotValidJwt');
const User = require('../models/user').default;

// контроллер регистрации
module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password
  } = req.body;
  if (!email || !password) {
    throw new NotValidCodeError('Пароль или почта не могут быть пустыми');
  }
  User.findOne({ email })
  .then((user) => {
    if (user) {
      throw new AlreadyExistData('Пользователь с таким email уже существует');
    } else {
    bcrypt.hash(req.body.password, 10)
      .then((hash) => User.create({
        name, about, avatar, email, password: hash,
      }))
      .then((user) => res.send({ user }))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          next(new NotValidCodeError('Переданы некорректные данные'));
        } else if (err.code === 11000) {
          next(new AlreadyExistData('Пользователь с таким email уже существует'));
        } else {
          next(err);
        }
      })
    };
    .catch((err) => {
      next(err);
    })
});
// контроллер login
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'SECRET_KEY',
        { expiresIn: '7d' },
      );
      return res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotValidJwt('Переданы неправильные почта или пароль'));
      } else {
        next(err);
      }
    });
};
// сработает при GET-запросе на URL /users
module.exports.getUsers = (_req, res, next) => {
  User.find({})
    .then((user) => res.send({ user }))
    .catch((err) => {
      next(err);
    });
};
// сработает при GET-запросе на URL /users/:userId
module.exports.getUserById = (req, res, next) => {
  const { userId } = req.params;
  User.findById({ _id: userId })
    .orFail(new NotFoundError('Пользователь не найден'))
    .then((user) => {
      res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotValidCodeError('Переданы некорректные данные id'));
      } else {
        next(err);
      }
    });
};
// сработает при GET запросе на URL /users/me
module.exports.getMe = (req, res, next) => {
  User.findById(req.user_id)
    .orFail(new NotFoundError('Пользователь не найден'))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      next(err);
    });
};
// обновляет профиль
module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { runValidators: true, new: true },
  )
    .orFail(new NotFoundError('Пользователь не найден'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new NotValidCodeError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};
// обновляет аватар
module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { runValidators: true, new: true },
  )
    .orFail(new NotFoundError('Пользователь не найден'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new NotValidCodeError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};
