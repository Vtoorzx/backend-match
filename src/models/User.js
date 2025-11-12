const mongoose = require('mongoose');

// Garante que a conexão use o schema de forma segura no ambiente de produção (Render)
const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Nome completo é obrigatório.'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email é obrigatório.'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Por favor, insira um email válido.',
      ],
    },
    cpf: {
      type: String,
      required: [true, 'CPF é obrigatório.'],
      unique: true,
      trim: true,
      minlength: [11, 'CPF deve ter 11 dígitos.'],
      maxlength: [11, 'CPF deve ter 11 dígitos.'],
      match: [/^\d{11}$/, 'CPF deve conter apenas números.'],
    },
    dateOfBirth: {
      type: Date,
      required: [true, 'Data de nascimento é obrigatória.'],
    },
    password: {
      type: String,
      required: [true, 'Senha é obrigatória.'],
      select: false, // evita retornar a senha por padrão
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    // Evita problemas de índice duplicado no Render (útil para deploys múltiplos)
    timestamps: true,
    versionKey: false,
  }
);

// Evita erro de “OverwriteModelError” no Render ou no ambiente serverless
// (Render pode recriar a conexão em novos processos)
module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
