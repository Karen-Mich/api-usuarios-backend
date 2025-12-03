const express = require('express');
const cors = require('cors');  // 👈 AGREGAR ESTO
require('dotenv').config();
const app = express();

const usuariosRoutes = require('./routes/usuarios');
const errorHandler = require('./middlewares/errorHandler');

// 👇 AGREGAR CORS ANTES DE express.json()
app.use(cors({
  origin: 'http://localhost:5174',  // Puerto de Vite
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use('/usuarios', usuariosRoutes);

app.use(errorHandler);

module.exports = app;