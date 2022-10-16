const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;
// const JWT_TOKEN = require('../utils/constants');
const NotValidJwt = require('../errors/NotValidJwt');
const BadRequestError = require('../errors/BadRequestError');

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new BadRequestError('Нужна авторизация'); // 400
  } else {
    const token = authorization.replace('Bearer ', '');
    let payload;

    try {
      payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'SECRET_KEY');
    } catch (err) {
      throw new NotValidJwt('Авторизация не успешна'); // 401
    }
    req.user = payload;
    next();
  }
};
module.exports = auth;
