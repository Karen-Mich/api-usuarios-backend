const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const User = sequelize.define('usuarios', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  apellido: {  
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  rol: {
    type: DataTypes.ENUM('admin', 'usuario'),
    allowNull: false,
    defaultValue: 'usuario'
  }
}, {
  tableName: 'usuarios',
  timestamps: true
});

module.exports = User;