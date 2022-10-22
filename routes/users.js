const router = require('express').Router();
const {
  getUsers,
  getUserById,
  getCurrentUser,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');
const {
  userIdValidation,
  profileValidation,
  avatarValidation,
} = require('../middlewares/validation');

// информация о пользователе
router.get('/me', getCurrentUser);

// список пользователей
router.get('/', getUsers);

// поиск пользователя по userId
router.get('/:userId', userIdValidation, getUserById);

// обновляет профиль
router.patch('/me', profileValidation, updateProfile);

// обновляет аватар
router.patch('/me/avatar', avatarValidation, updateAvatar);

module.exports = router;
