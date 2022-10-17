const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { JWT_SECRET = 'pkuvqwongbqpoiqoufnvsvybqp' } = process.env;
const AlreadyExistDataError = require('../errors/AlreadyExistDataError');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const NotValidJwt = require('../errors/NotValidJwt');

const User = require('../models/user');
const NoAccessError = require('../errors/NoAccessError');

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
        throw new AlreadyExistDataError('Пользователь с таким email уже существует'); // 409
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
              next(new BadRequestError('Переданы некорректные данные')); // 400
            // } else if (err.code === 11000) {
            //   next(new AlreadyExistDataError('Пользователь с таким email уже существует'));
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
  if (!email || !password) {
    throw new BadRequestError('Пароль или почта не могут быть пустыми'); // 400
  }
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        throw new NoAccessError('Такого пользователя не существует'); // 403
      }
      bcrypt.compare(password, user.password, (error, isValidPassword) => {
        if (!isValidPassword) {
          throw new NotValidJwt('Пароль не верен'); // 401
        }
        const token = jwt.sign(
          { _id: user._id },
          JWT_SECRET,
          { expiresIn: '7d' },
        );
        return res.cookie('jwt', token, { maxAge: 3600000 * 24 * 7, httpOnly: true }).end();
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
    .then((userData) => res.send({
      name: userData.name,
      about: userData.about,
      avatar: userData.avatar,
      email: userData.email,
      id: userData._id,
    }))
    .catch((err) => {
      next(err);
    });
};
// сработает при GET-запросе на URL /users/:userId
module.exports.getUserById = (req, res, next) => {
  const { userId } = req.params;
  User.findById({ _id: userId })
    .orFail(new NotFoundError('Пользователь не найден'))
    .then((userData) => {
      res.send({
        name: userData.name,
        about: userData.about,
        avatar: userData.avatar,
        email: userData.email,
        id: userData._id,
      });
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
module.exports.getUserInfo = (req, res, next) => {
  const owner = req.user._id;
  User.findById({ _id: owner })
    .orFail(new NotFoundError('Пользователь не найден'))
    .then((userData) => res.send({
      name: userData.name,
      about: userData.about,
      avatar: userData.avatar,
      email: userData.email,
      id: userData._id,
    }))
    .catch((err) => {
      if (err.name === 'Bad Request') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
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
    .then((userData) => res.send({
      name: userData.name,
      about: userData.about,
      avatar: userData.avatar,
    }))
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
    .then((userData) => res.send({
      name: userData.name,
      about: userData.about,
      avatar: userData.avatar,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};
