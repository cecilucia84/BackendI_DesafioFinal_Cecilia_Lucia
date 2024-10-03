import { Router } from 'express';
import Controller from '../controller/products.controller.js';

const router = Router();

router.get('/', (req, res) => new Controller().getProducts(req, res));

// Ruta para obtener un producto por su ID
router.get('/:pid', (req, res) => new Controller().getProductById(req, res));

// Ruta para agregar un nuevo producto
router.post('/', (req, res) => new Controller().addProduct(req, res));

// Ruta para actualizar un producto por su ID
router.put('/:pid', (req, res) => new Controller().updateProduct(req, res));

// Ruta para eliminar un producto por su ID
router.delete('/:pid', (req, res) => new Controller().deleteProduct(req, res));

export default router;