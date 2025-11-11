require('dotenv').config();

const express = require('express');
const connectDB = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const cors = require('cors'); 

connectDB();

const app = express();


const ALLOWED_ORIGIN = 'https://match-c35f.vercel.app'; 

const corsOptions = {
   
    origin: (origin, callback) => {
        if (origin === ALLOWED_ORIGIN || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS Policy: ' + origin));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
};


app.use(cors(corsOptions));


app.use(express.json());

app.get('/', (req, res)=> {
    res.send('Match+ rodando!');
});


app.use('/auth', authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));