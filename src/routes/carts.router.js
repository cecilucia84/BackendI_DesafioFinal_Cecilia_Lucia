import { Router } from 'express';
import Controller from '../controller/cart.controller.js';

const router = Router(); // Crea un enrutador

// Ruta para obtener todos los carritos
router.get('/', (req, res) => new Controller().getCarts(req, res));

// Ruta para obtener un carrito por su ID
router.get('/:cid', (req, res) => new Controller().getCartById(req, res));

// Ruta para agregar un nuevo carrito
router.post('/', (req, res) => new Controller().createCart(req, res));

// Ruta para agregar un producto a un carrito
router.post('/:cid/product/:pid', (req, res) => new Controller().addProductToCart(req, res));

// Ruta para actualizar el carrito con un arreglo de productos
router.put('/:cid', (req, res) => new Controller().updateCart(req, res));

// Ruta para eliminar un producto del carrito
router.delete('/:cid/product/:pid', (req, res) => new Controller().deleteProductFromCart(req, res));

// Ruta para atualizar la cantidad de un producto en el carrito
router.put('/:cid/products/:pid', (req, res) => new Controller().updateProductQuantity(req, res));

// Ruta para vaciar el carrito
router.delete('/:cid', (req, res) => new Controller().clearCart(req, res));

export default router; // Exporta el enrutador
