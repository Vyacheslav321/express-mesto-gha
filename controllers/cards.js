const NotFoundError = require("../errors/NotFoundError");
const NotValidCodeError = require("../errors/NotValidCodeError");
const Card = require("../models/card");

// сработает при GET-запросе на URL /cards
module.exports.getCards = (_req, res, next) => {
  Card.find({})
    .populate("owner")
    .then((cards) => res.send({ cards }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new NotValidCodeError("Переданы некорректные данные id"));
      }
      next(err);
    });
};

// сработает при POST-запросе на URL /cards
module.exports.createCard = (req, res, next) => {
  const owner = req.user._id; // _id станет доступен
  const { name, link } = req.body;
  Card.create({ name, link, owner })
    .then((card) => res.send({ card }))
    .catch((err) => {
      console.log(err.name);
      if (err.name === "ValidationError") {
        next(new NotValidCodeError("Переданы некорректные данные id"));
      }
      next(err);
    });
};

// сработает при DELETE-запросе на URL /cards/:cardId
module.exports.deleteCard = (req, res, next) => {
  const owner = req.user._id; // _id станет доступен
  const { cardId } = req.params;
  Card.findById(cardId).orFail(new NotFoundError("Карточка не найдена"))
    .then((card) => {
      if (owner.toString() !== card.owner.toString()) {
        return res.send({
          message: `Пользователь с ID ${owner} не является владельцем данной карточки`,
        });
      }
      Card.findByIdAndRemove(cardId).then(() => {
        res.send({ message: `Карточка с ID ${card.id} удалена` });
      });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new NotValidCodeError('Передан несуществующий ID карточки'));
      } else if (err.name === "ValidationError") {
        next(new NotFoundError("Карточка по указанному _id не найдена"));
      }
      next(err);
    });
};
// next(new NotFoundError("Карточка по указанному _id не найдена"));
// next(new NotValidCodeError(err.message));

// поставить лайк карточке
module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true }
  )
    .orFail(new NotFoundError("Карточка не найдена"))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === "CastError") {
        next(new NotValidCodeError("Передан несуществующий ID карточки"));
      } else if (err.name === "ValidationError") {
        next(new NotValidCodeError(err.message));
      }
      next(err);
    });
};

// убрать лайк карточки
module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true }
  )
    .orFail(new NotFoundError("Карточка не найдена"))
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new NotValidCodeError("Передан несуществующий ID карточки"));
      } else if (err.name === "ValidationError") {
        next(new NotValidCodeError(err.message));
      }
      next(err);
    });
};
