const jwt = require('jsonwebtoken');

const { JWT_SECRET = 'pkuvqwongbqpoiqoufnvsvybqp' } = process.env;
const NotValidError = require('../errors/NotValidError');
const BadRequestError = require('../errors/BadRequestError');

const auth = (request, res, next) => {
  const token = request.cookies.jwt;

  if (!token) {
    throw new NotValidError('Требуется авторизация'); // 401
  }
  let playload;

  try {
    playload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return next(new BadRequestError('token is not valid')); // 400
  }

  request.user = playload;
  return next();
};

module.exports = auth;
