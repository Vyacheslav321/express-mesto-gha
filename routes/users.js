const router = require('express').Router();
const {
  getUsers,
  getUserById,
  getMe,
  updateProfile,
  updateAvatar,
  login,
  createUser,
} = require('../controllers/users');

// сработает при GET-запросе на URL /users
router.get('/users', getUsers);
// сработает при GET-запросе на URL /users/:userId
router.get('/users/:userId', getUserById);
// сработает при POST-запросе на URL /users
router.get('/users/me', getMe);
// обновляет профиль
router.patch('/users/me', updateProfile);
// обновляет аватар
router.patch('/users/me/avatar', updateAvatar);
// Логнин
router.post('/signin', login);
// Регистрация
router.post('/signup', createUser);

module.exports = router;
