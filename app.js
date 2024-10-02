import express from 'express';
import path from 'path';
import exphbs from 'express-handlebars';
import mongoose from 'mongoose';
import connectDB from './src/config/db.js';
import productRoutes from './src/routes/products.router.js';
import cartRoutes from './src/routes/carts.router.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Configurar dotenv
dotenv.config();

// Inicializar Express
const app = express();

// Definir __filename y __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Conectar a la base de datos MongoDB
connectDB();

// Configurar el motor de plantillas Handlebars
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'src', 'views'));

// Middleware para parsear JSON y datos de formularios
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Configuración de archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rutas de la API
app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);

// Ruta principal (Home Page)
app.get('/', (req, res) => {
    res.render('index', { title: 'Bienvenido a Tres Tartas' });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
