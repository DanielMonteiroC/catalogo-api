require('dotenv').config();

const app = require('./app');
const sequelize = require('./config/postgres');
const conectarMongoDB = require('./config/mongodb');

const PORT = process.env.PORT || 3000;

async function iniciar() {
  try {
    // Conecta ao PostgreSQL e sincroniza as tabelas
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log('✅ PostgreSQL conectado e tabelas sincronizadas.');

    // Conecta ao MongoDB
    await conectarMongoDB();

    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
      console.log(`📄 Documentação: http://localhost:${PORT}/api-docs`);
    });
  } catch (err) {
    console.error('❌ Falha ao iniciar a aplicação:', err.message);
    process.exit(1);
  }
}

iniciar();
