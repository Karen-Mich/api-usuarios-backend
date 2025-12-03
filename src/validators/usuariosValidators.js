const Joi = require('joi');

const crearUsuario = Joi.object({
  nombre: Joi.string().min(2).max(100).required()
    .messages({
      'string.empty': 'El nombre es requerido',
      'string.min': 'El nombre debe tener al menos 2 caracteres',
      'string.max': 'El nombre no puede exceder 100 caracteres'
    }),
  apellido: Joi.string().min(2).max(100).required() 
    .messages({
      'string.empty': 'El apellido es requerido',
      'string.min': 'El apellido debe tener al menos 2 caracteres',
      'string.max': 'El apellido no puede exceder 100 caracteres'
    }),
  email: Joi.string().email().required()
    .messages({
      'string.email': 'Formato de email inválido',
      'string.empty': 'El email es requerido'
    }),
  password: Joi.string().min(6).required()
    .messages({
      'string.min': 'La contraseña debe tener al menos 6 caracteres',
      'string.empty': 'La contraseña es requerida'
    }),
  rol: Joi.string().valid('admin', 'usuario').optional()
    .messages({
      'any.only': 'El rol debe ser "admin" o "usuario"'
    })
});

const actualizarUsuario = Joi.object({
  nombre: Joi.string().min(2).max(100).optional()
    .messages({
      'string.min': 'El nombre debe tener al menos 2 caracteres',
      'string.max': 'El nombre no puede exceder 100 caracteres'
    }),
  apellido: Joi.string().min(2).max(100).optional()  // ⭐ NUEVO CAMPO
    .messages({
      'string.min': 'El apellido debe tener al menos 2 caracteres',
      'string.max': 'El apellido no puede exceder 100 caracteres'
    }),
  email: Joi.string().email().optional()  // ⭐ AGREGAR email (opcional en actualización)
    .messages({
      'string.email': 'Formato de email inválido'
    }),
  password: Joi.string().min(6).optional()
    .messages({
      'string.min': 'La contraseña debe tener al menos 6 caracteres'
    }),
  rol: Joi.string().valid('admin', 'usuario').optional()
    .messages({
      'any.only': 'El rol debe ser "admin" o "usuario"'
    }),
  estado: Joi.boolean().optional()
});

module.exports = { crearUsuario, actualizarUsuario };