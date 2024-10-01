import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        // Conectar a la base de datos sin las opciones obsoletas
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB conectado');
    } catch (error) {
        console.error('Error al conectar a MongoDB:', error);
        process.exit(1); // Salir del proceso si hay un error
    }
};

export default connectDB; // Asegúrate de tener esta línea para exportar la función por defecto
