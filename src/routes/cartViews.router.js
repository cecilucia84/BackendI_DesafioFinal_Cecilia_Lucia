import { Router } from 'express';
import Controller from '../controller/cartView.controller.js';

const router = Router(); // Crea un enrutador

// Ruta para obtener un carrito por su ID
router.get('/:cid', (req, res) => new Controller().getCartById(req, res));

export default router; // Exporta el enrutador
