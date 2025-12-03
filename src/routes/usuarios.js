const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');
const auth = require('../middlewares/auth');

// Rutas públicas PRIMERO
router.post('/login', usuariosController.login);
router.post('/', usuariosController.createUsuario);

// Rutas protegidas - GET genérico PRIMERO
router.get('/', auth, usuariosController.getUsuarios);

// Luego las rutas con parámetros
router.get('/:id', auth, usuariosController.getUsuarioById);
router.put('/:id', auth, usuariosController.updateUsuario);
router.delete('/:id', auth, usuariosController.deleteUsuario);

module.exports = router;