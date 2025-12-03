const app = require('./app');
const { sequelize } = require('./config/database');

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conectado a MySQL con Sequelize');
    app.listen(PORT, () => console.log(`🚀 Servidor en http://localhost:${PORT}`));
  } catch (error) {
    console.error('❌ Error al conectar a la base de datos:', error);
  }
})();
