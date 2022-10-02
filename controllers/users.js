const User = require("../models/user");

// сработает при GET-запросе на URL /users
module.exports.getUsers = (_req, res) => {
  User.find({})
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(400)
          .send({ message: `${err.name}: Некорректные данные` });
      }
      return res
        .status(500)
        .send({ message: `${err.name}: На сервере произошла ошибка` });
    });
};
// сработает при GET-запросе на URL /users/:userId
module.exports.getUserById = (req, res) => {
  User.findOne({ _id: req.params.userId })
    .then((user) => {
      if (!user) {
        return res.send({
          message: `${err.name}: Пользователь по указанному _id не найден`,
        });
      }
      res.send({ data: user });
    })
    .catch((err) => {
      console.log({ err });
      if (err.name === "NotFoundError") {
        return res
          .status(404)
          .send({
            message: `${err.name}: Пользователь по указанному _id не найден`,
          });
      } else if (err.name === "ReferenceError") {
        return res
          .status(500)
          .send({ message: `${err.name}: На сервере произошла ошибка` });
      }
    });
};
// сработает при POST-запросе на URL /users
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(400)
          .send({
            message: `${err.name}: Некорректные данные при создании пзльзователя`,
          });
      }
      return res
        .status(500)
        .send({ message: `${err.name}: На сервере произошла ошибка` });
    });
};
// обновляет профиль
module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(400)
          .send({
            message: `${err.name}: Некорректные данные при создании пользователя`,
          });
      } else if (err.name === "NotFoundError") {
        return res
          .status(404)
          .send({
            message: `${err.name}: Пользователь по указанному _id не найден`,
          });
      }
      return res
        .status(500)
        .send({ message: `${err.name}: На сервере произошла ошибка` });
    });
};
// обновляет аватар
module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(400)
          .send({
            message: `${err.name}: Некорректные данные при создании пользователя`,
          });
      } else if (err.name === "NotFoundError") {
        return res
          .status(404)
          .send({
            message: `${err.name}: Пользователь по указанному _id не найден`,
          });
      }
      return res
        .status(500)
        .send({ message: `${err.name}: На сервере произошла ошибка` });
    });
};