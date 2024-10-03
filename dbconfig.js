import dotenv from 'dotenv';

dotenv.config(); // Asegúrate de cargar las variables de entorno

const config = {
    mongoUrl: process.env.MONGODB_URI,  // Asegúrate de que esté leyendo correctamente
    dbName: process.env.MONGODB_NAME
};

export default config;
