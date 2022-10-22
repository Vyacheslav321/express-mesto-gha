const router = require('express').Router();
const {
  createUser,
  login,
  signout,
} = require('../controllers/users');
const {
  signupValidation,
  signinValidation,
} = require('../middlewares/validation');

// Регистрация
router.post('/signup', signupValidation, createUser);

// Логнин
router.post('/signin', signinValidation, login);

// SignOut
router.post('/signout', signout);

module.exports = router;
