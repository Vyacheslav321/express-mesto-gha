const jwt = require('jsonwebtoken');

const JWT_TOKEN = require('../utils/constants');
const NotValidJwt = require('../errors/NotValidJwt');
const NoAccessError = require('../errors/NoAccessError');

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    throw new NotValidJwt('Требуется авторизация');
  }
  let playload;
  try {
    playload = jwt.verify(token, JWT_TOKEN);
  } catch (err) {
    return next(new NoAccessError('Ошибка авторизации'));
  }

  req.user = playload;
  return next();
};
module.exports = auth;
