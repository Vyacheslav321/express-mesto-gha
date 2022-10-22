const router = require('express').Router();
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');
const {
  createCardValidation,
  cardIdValidation,
} = require('../middlewares/validation');

// cards — возвращает все карточки
router.get('/', getCards);
// cards — создаёт карточку
router.post('/', createCardValidation, createCard);
// удаляет карточку по идентификатору
router.delete('/:cardId', cardIdValidation, deleteCard);
// поставить лайк карточке
router.put('/:cardId/likes', cardIdValidation, likeCard);
// убрать лайк с карточки
router.delete('/:cardId/likes', cardIdValidation, dislikeCard);

module.exports = router;
