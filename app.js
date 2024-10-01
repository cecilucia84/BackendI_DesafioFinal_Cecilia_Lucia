// Importaciones necesarias
import express from 'express';
import path from 'path';
import exphbs from 'express-handlebars';
import mongoose from 'mongoose'; // Mongoose para conectar a MongoDB
import connectDB from './src/config/db.js'; // Importa la conexión a la base de datos
import productRoutes from './src/routes/products.router.js'; // Rutas de productos
import cartRoutes from './src/routes/carts.router.js'; // Rutas de carritos
import dotenv from 'dotenv'; // Para cargar las variables de entorno
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Inicializar Express
const app = express();

// Definir __filename y __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configurar dotenv para leer el archivo .env
dotenv.config();

// Conectar a la base de datos MongoDB
connectDB(); // Asegúrate de manejar errores en esta función

// Configurar el motor de plantillas Handlebars
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'src', 'views'));

// Middleware para parsear JSON y datos de formularios
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Configuración de archivos estáticos (CSS, JS, imágenes, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Rutas de la API
app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);

// Ruta principal (Home Page)
app.get('/', (req, res) => {
    res.render('index', { title: 'Bienvenido a la tienda' });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
