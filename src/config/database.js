const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // 👇 Linha adicionada para mostrar o valor real da variável no Render
    console.log('🔍 Valor real do MONGO_URI:', JSON.stringify(process.env.MONGO_URI));

    if (!process.env.MONGO_URI) {
      throw new Error('A variável de ambiente MONGO_URI não está configurada.');
    }

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000 
    });

    console.log('✅ MongoDB conectado com sucesso!');
  } catch (err) {
    console.error('❌ Erro ao conectar ao MongoDB:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
