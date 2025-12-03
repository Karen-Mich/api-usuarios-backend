const ApiError = require('../errors/ApiError');

function authorizeRoles(...rolesPermitidos) {
  return (req, res, next) => {
    if (!rolesPermitidos.includes(req.user.rol)) {
      return next(ApiError.forbidden('No tienes permisos para esta acción'));
    }
    next();
  };
}

module.exports = authorizeRoles;
