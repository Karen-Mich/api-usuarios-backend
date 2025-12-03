const ApiError = require('../errors/ApiError');

function validate(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return next(ApiError.badRequest(error.details.map(e => e.message).join(', ')));
    }
    next();
  };
}

module.exports = { validate };
