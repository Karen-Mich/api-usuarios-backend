const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ApiError = require('../errors/ApiError');
const { parseQuery } = require('../utils/queryParser');

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return next(ApiError.unauthorized('Credenciales incorrectas'));

    const match = await bcrypt.compare(password, user.password);
    if (!match) return next(ApiError.unauthorized('Credenciales incorrectas'));

    const token = jwt.sign(
      { userId: user.id, email: user.email, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        rol: user.rol
      }
    });
  } catch (err) {
    next(err);
  }
}

async function getUsuarios(req, res, next) {
  try {
    const { limit, offset, order, filters, page } = parseQuery(req.query);

    const { count, rows } = await User.findAndCountAll({
      where: filters,
      limit,
      offset,
      order,
      attributes: { exclude: ['password'] }
    });

    const totalPages = Math.ceil(count / limit);

    res.json({
      total: count,
      page: page,
      limit: limit,
      data: rows
    });
  } catch (err) {
    next(err);
  }
}

async function createUsuario(req, res, next) {
  try {
    const { nombre, apellido, email, password, rol } = req.body;  
    
    if (!nombre || !apellido || !email || !password) {
      return next(ApiError.badRequest('Nombre, apellido, email y password son requeridos'));
    }

    const existe = await User.findOne({ where: { email } });
    if (existe) return next(ApiError.badRequest('El email ya está registrado'));

    const hashed = await bcrypt.hash(password, 10);
    
    const nuevo = await User.create({ 
      nombre, 
      apellido,  
      email, 
      password: hashed, 
      rol 
    });
    
    const { password: _, ...userData } = nuevo.toJSON();
    res.status(201).json(userData);
  } catch (err) {
    next(err);
  }
}

async function updateUsuario(req, res, next) {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return next(ApiError.notFound('Usuario no encontrado'));

    const updates = { ...req.body };
    
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    await user.update(updates);
    
    const { password: _, ...userData } = user.toJSON();
    res.json(userData);
  } catch (err) {
    next(err);
  }
}

async function getUsuarioById(req, res, next) {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return next(ApiError.notFound('Usuario no encontrado'));
    }
    
    res.json(user);
  } catch (err) {
    next(err);
  }
}

async function deleteUsuario(req, res, next) {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return next(ApiError.notFound('Usuario no encontrado'));

    await user.destroy();
    res.json({ mensaje: 'Usuario eliminado correctamente' });
  } catch (err) {
    next(err);
  }
}

module.exports = { login, getUsuarios, createUsuario, updateUsuario, getUsuarioById, deleteUsuario };