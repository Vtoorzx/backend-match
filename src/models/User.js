    const mongoose = require('mongoose');

    const UserSchema = new mongoose.Schema({
        fullName: {
            type: String,
            required: [true, 'Nome completo obrigatório']
        },
        email: {
            type: String,
            required: [true, 'Email é obrigatório'],
            unique: true,
            lowercase: true,
            trim: true
        },
        cpf: {
            type: String,
            required: [true, 'CPF é obrigatório'],
            unique: true,
            trim: true,
            minlength: [11, 'CPF deve ter 11 digitos'],
            maxlength: [11, 'CPF deve ter 11 digitos']
        },
        dateOfBirth:{
            type: Date,
            required: [true, 'Data de nascimento é obrigatória'],
        },
        password: {
            type: String,
            required: [true, 'Senha é obrigatória'],
            select: false
        },
        createAt: {
            type: Date,
            default: Date.now
        }
    });

    module.exports = mongoose.model('User', UserSchema);