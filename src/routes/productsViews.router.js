import { Router } from 'express';
import Controller from '../controller/productsView.controller.js';

const router = Router(); // Crea un enrutador

// Ruta para obtener todos los productos
router.get('/', (req, res) => new Controller().getProducts(req, res));

// Ruta para obtener un producto por su ID
router.get('/:pid', (req, res) => new Controller().getProductById(req, res));

// Ruta para agregar producto al carrito
router.post('/:pid', (req, res) => new Controller().addProductToCart(req, res));

export default router; // Exporta el enrutador
