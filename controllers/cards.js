const Card = require("../models/card");

// сработает при GET-запросе на URL /cards
module.exports.getCards = (_req, res) => {
  Card.find({})
    .populate("owner")
    .then((cards) => res.send({ cards }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(400)
          .send({
            message: `${err.name}: Некорректные данные при создании карточки`,
          });
      }
      return res
        .status(500)
        .send({ message: `${err.name}: На сервере произошла ошибка` });
    });
};

// сработает при POST-запросе на URL /cards
module.exports.createCard = (req, res) => {
  const owner = req.user._id; // _id станет доступен
  const { name, link } = req.body;
  Card.create({ name, link, owner })
    .then((card) => res.send({ card }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(400)
          .send({
            message: `${err.name}: Некорректные данные при создании карточки`,
          });
      }
      return res
        .status(500)
        .send({ message: `${err.name}: На сервере произошла ошибка` });
    });
};

// сработает при DELETE-запросе на URL /cards/:cardId
module.exports.deleteCard = (req, res) => {
  const owner = req.user._id; // _id станет доступен
  const { cardId } = req.params;
  Card.findById(cardId)
    .then((card) => {
      if (owner.toString() !== card.owner.toString()) {
        return res.send({
          message: `Пользователь с ID ${owner} не является владельцем данной карточки`,
        });
      } else {
        Card.findByIdAndRemove(cardId)
          .then(() => {
            res.send({ message: `Карточка с ID ${card.id} удалена` });
          })
      }
    })
    .catch((err) => {
      console.log(err.code)
      if (err.name === "NotFoundError") {
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

// поставить лайк карточке
module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true }
  )
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(400)
          .send({
            message: `${err.name}: Некорректные данные при постановке лайка`,
          });
      } else if (err.name === "NotFoundError") {
        return res
          .status(404)
          .send({
            message: `${err.name}: Передан несуществующий _id карточки`,
          });
      }
      return res
        .status(500)
        .send({ message: `${err.name}: На сервере произошла ошибка` });
    });
};

// убрать лайк карточки
module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true }
  )
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(400)
          .send({
            message: `${err.name}: Некорректные данные при постановке лайка`,
          });
      } else if (err.name === "NotFoundError") {
        return res
          .status(404)
          .send({
            message: `${err.name}: Передан несуществующий _id карточки`,
          });
      }
      return res
        .status(500)
        .send({ message: `${err.name}: На сервере произошла ошибка` });
    });
};
