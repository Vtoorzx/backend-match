const mongoose = require ('mongoose');

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDb conectado!');
    } catch(err){
        console.error('Erro ao conectar o servidor:')
        process.exit(1);
    }
}

module.exports = connectDB;