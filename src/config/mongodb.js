const mongoose = require('mongoose');

const conectarMongoDB = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/catalogo_nosql';
    await mongoose.connect(uri);
    console.log('✅ MongoDB conectado com sucesso.');
  } catch (err) {
    console.error('❌ Falha ao conectar ao MongoDB:', err.message);
    process.exit(1);
  }
};

module.exports = conectarMongoDB;
