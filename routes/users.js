const router = require('express').Router();
const {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

// сработает при GET-запросе на URL /users
router.get('/users', getUsers);
// сработает при GET-запросе на URL /users/:userId
router.get('/users/:userId', getUserById);
// сработает при POST-запросе на URL /users
router.post('/users', createUser);
// обновляет профиль
router.patch('/users/me', updateProfile);
// обновляет аватар
router.patch('/users/me/avatar', updateAvatar);

module.exports = router;
