const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const Card = require('../models/card');
const NoAccessError = require('../errors/NoAccessError');

// сработает при GET-запросе на URL /cards
module.exports.getCards = (_req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send(cards))
    .catch((err) => {
      next(err);
    });
};

// сработает при POST-запросе на URL /cards
module.exports.createCard = (req, res, next) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  Card.create({ name, link, owner })
    .populate(['owner'])
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные id'));
      } else {
        next(err);
      }
    });
};

// сработает при DELETE-запросе на URL /cards/:cardId
module.exports.deleteCard = (req, res, next) => {
  const owner = req.user._id;
  const { cardId } = req.params;
  Card.findById(cardId)
    .orFail(new NotFoundError('Карточка не найдена'))
    .then((card) => {
      // Проверка на принадлежность карточки пользователю
      if (owner.toString() !== card.owner.toString()) {
        return next(new NoAccessError(`Пользователь с ID ${owner} не является владельцем данной карточки`));
      }
      return Card.findByIdAndRemove(cardId)
        .then(() => {
          res.send({ message: `Карточка с ID ${card.id} удалена` });
        })
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Передан несуществующий ID карточки'));
      }
      next(err);
    });
};

// поставить лайк карточке
module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .populate(['owner', 'likes'])
    .orFail(new NotFoundError('Карточка не найдена'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Передан несуществующий ID карточки'));
      }
      next(err);
    });
};

// убрать лайк карточки
module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .populate(['owner', 'likes'])
    .orFail(new NotFoundError('Карточка не найдена'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Передан несуществующий ID карточки'));
      }
      next(err);
    });
};
