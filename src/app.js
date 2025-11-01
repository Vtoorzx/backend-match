require('dotenv').config();

const express = require('express');
const connectDB = require('./config/database');
const authRoutes = require('./routes/authRoutes');



connectDB();

const app = express();
app.get('/', (req, res)=> {
    res.send('Match+ rodando!');
});

app.use('/api/auth', authRoutes);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log('Servidor rodando na porta ${PORT}'));