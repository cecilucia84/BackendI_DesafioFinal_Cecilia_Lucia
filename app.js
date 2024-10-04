import express from 'express';
import path from 'path';
import exphbs from 'express-handlebars';
import mongoose from 'mongoose';
import { cartRouter, cartRouterView, productRouter, productRouterView } from './src/routes/index.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import config from './dbconfig.js';


const app = express();


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const { mongoUrl, dbName } = config


app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'src', 'views'));


app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use(express.static(path.join(__dirname, 'public')));


app.use('/api/products', productRouter);
app.use('/products', productRouterView);
app.use('/api/carts', cartRouter);
app.use('/carts', cartRouterView);


const startServer = async () => {
    try {
        await mongoose.connect(mongoUrl, { dbName });
        console.log('Conectado correctamente a MongoDB');

        const PORT = process.env.PORT || 8080;

        app.listen(PORT, '0.0.0.0', () => {
            console.log(`\nServidor cargado en el puerto ${PORT}`);
        });
    } catch (error) {
        console.error('Error al iniciar el servidor:', error);
    };
};

startServer();
