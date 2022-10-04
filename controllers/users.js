const NotFoundError = require('../errors/NotFoundError');
const NotValidCodeError = require('../errors/NotValidCodeError');

const User = require('../models/user');

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
// сработает при POST-запросе на URL /users
module.exports.createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new NotValidCodeError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};
// обновляет профиль
module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { runValidators: true, new: true })
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
  User.findByIdAndUpdate(req.user._id, { avatar }, { runValidators: true, new: true })
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
