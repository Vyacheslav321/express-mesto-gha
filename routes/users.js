const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers,
  getUserById,
  getUserInfo,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');
const { linkReg } = require('../utils/constants');

// сработает при GET-запросе на URL /users
router.get('/users', getUsers);
// сработает при GET-запросе на URL /users/:userId
router.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24).required(),
  }),
}), getUserById);
// сработает при GET-запросе на URL /users/me
router.get('/users/me', getUserInfo);
// обновляет профиль
router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateProfile);
// обновляет аватар
router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(linkReg), //
  }),
}), updateAvatar);

module.exports = router;
