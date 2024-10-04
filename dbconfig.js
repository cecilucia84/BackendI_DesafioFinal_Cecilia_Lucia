import dotenv from 'dotenv';

dotenv.config(); 

const config = {
    mongoUrl: process.env.MONGODB_URI, 
    dbName: process.env.MONGODB_NAME
};

export default config;
