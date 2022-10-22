const jwt = require('jsonwebtoken');

const { JWT_SECRET = 'pkuvqwongbqpoiqoufnvsvybqp' } = process.env;
const NotValidError = require('../errors/NotValidError');

const auth = (request, res, next) => {
  const token = request.cookies.jwt;

  if (!token) {
    throw new NotValidError('Требуется авторизация'); // 401
  }
  let playload;

  try {
    playload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return next(new NotValidError('token is not valid')); // 401
  }

  request.user = playload;
  return next();
};

module.exports = auth;
