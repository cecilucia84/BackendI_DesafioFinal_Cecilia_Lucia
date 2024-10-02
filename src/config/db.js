// src/config/db.js

import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Conectar a la base de datos MongoDB
    await mongoose.connect(process.env.MONGODB_URI); // Eliminadas las opciones obsoletas
    console.log('Conectado a MongoDB');
  } catch (error) {
    console.error('Error de conexión a MongoDB:', error.message);
    process.exit(1); // Salir del proceso si hay un error
  }
};

export default connectDB;
