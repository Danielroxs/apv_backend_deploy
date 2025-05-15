import mongoose from "mongoose";

const conectarDB = async () => {
    try {
        const db = await mongoose.connect(process.env.MONGO_URI, {
            socketTimeoutMS: 30000, // Aumenta el tiempo de espera a 30 segundos
        });
        const url = `${db.connection.host}:${db.connection.port}`;
        console.log(`MongoDB conectado en: ${url}`);
    } catch (error) {
        console.log(`Error al conectar a MongoDB: ${error.message}`);
        process.exit(1);
    }
}

export default conectarDB;