const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET = 'dfYSD54hvdhDSH7db5dsbDjg' } = process.env;
const AlreadyExistDataError = require('../errors/AlreadyExistDataError');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BarRequestError');
const NotValidJwt = require('../errors/NotValidJwt');

const User = require('../models/user').default;

// контроллер регистрации
module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  if (!email || !password) {
    throw new BadRequestError('Пароль или почта не могут быть пустыми'); // 400
  }
  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new AlreadyExistDataError('Пользователь с таким email уже существует'); // сделай AlreadyExistData 403
      } else {
        bcrypt.hash(password, 10)
          .then((hash) => User.create({
            name, about, avatar, email, password: hash,
          }))
          .then((userData) => res.send({
            name: userData.name,
            about: userData.about,
            avatar: userData.avatar,
            email: userData.email,
            id: userData._id,
          }))
          .catch((err) => {
            if (err.name === 'ValidationError') {
              next(new BadRequestError('Переданы некорректные данные'));
            } else if (err.code === 11000) {
              next(new AlreadyExistDataError('Пользователь с таким email уже существует'));
            } else {
              next(err);
            }
          });
      }
    })
    .catch((err) => {
      next(err);
    });
};
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
module.exports.getUsers = (req, res, next) => {
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
        next(new BadRequestError('Переданы некорректные данные id'));
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
      if (user) {
        res.status(200).send({
          _is: user._id,
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          email: user.email,
        });
      }
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
        next(new BadRequestError('Переданы некорректные данные'));
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
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};
