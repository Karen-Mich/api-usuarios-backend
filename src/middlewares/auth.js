const jwt = require('jsonwebtoken');
const ApiError = require('../errors/ApiError');
require('dotenv').config();

function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return next(ApiError.unauthorized('Token no proporcionado'));
  }

  const token = header.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return next(ApiError.unauthorized('Token inválido o expirado'));
  }
}

module.exports = auth;
