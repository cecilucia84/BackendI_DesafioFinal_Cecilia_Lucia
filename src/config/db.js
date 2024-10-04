import mongoose from 'mongoose';

const connectDB = async () => {
    try {
      
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB conectado');
    } catch (error) {
        console.error('Error al conectar a MongoDB:', error);
        process.exit(1);
    }
};

export default connectDB; 