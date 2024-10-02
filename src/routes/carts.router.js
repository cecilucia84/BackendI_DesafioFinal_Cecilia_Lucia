import { Router } from 'express';
import mongoose from 'mongoose';
import Cart from '../models/Cart.js';

const router = Router();

// Helper para validar ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// DELETE api/carts/:cid/products/:pid - Eliminar un producto del carrito
router.delete('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;

    // Validar cid y pid
    if (!isValidObjectId(cid) || !isValidObjectId(pid)) {
        return res.status(400).json({ status: 'error', message: 'ID de carrito o producto no válido' });
    }

    try {
        const cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        }

        // Filtra y elimina el producto del carrito
        cart.products = cart.products.filter(product => product.productId.toString() !== pid);
        await cart.save();

        res.json({ status: 'success', message: 'Producto eliminado del carrito' });
    } catch (error) {
        console.error('Error al eliminar producto del carrito:', error);
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// PUT api/carts/:cid - Actualizar el carrito con un arreglo de productos
router.put('/:cid', async (req, res) => {
    const { cid } = req.params;
    const { products } = req.body; // Debería recibir un arreglo de productos

    // Validar cid
    if (!isValidObjectId(cid)) {
        return res.status(400).json({ status: 'error', message: 'ID de carrito no válido' });
    }

    try {
        const cart = await Cart.findByIdAndUpdate(cid, { products }, { new: true });
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        }

        res.json({ status: 'success', message: 'Carrito actualizado', cart });
    } catch (error) {
        console.error('Error al actualizar el carrito:', error);
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// PUT api/carts/:cid/products/:pid - Actualizar solo la cantidad de un producto en el carrito
router.put('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    // Validar cid y pid
    if (!isValidObjectId(cid) || !isValidObjectId(pid)) {
        return res.status(400).json({ status: 'error', message: 'ID de carrito o producto no válido' });
    }

    try {
        const cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        }

        const productIndex = cart.products.findIndex(product => product.productId.toString() === pid);

        if (productIndex > -1) {
            cart.products[productIndex].quantity = quantity;
            await cart.save();
            res.json({ status: 'success', message: 'Cantidad de producto actualizada', cart });
        } else {
            res.status(404).json({ status: 'error', message: 'Producto no encontrado en el carrito' });
        }
    } catch (error) {
        console.error('Error al actualizar la cantidad del producto:', error);
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// DELETE api/carts/:cid - Eliminar todos los productos del carrito
router.delete('/:cid', async (req, res) => {
    const { cid } = req.params;

    // Validar cid
    if (!isValidObjectId(cid)) {
        return res.status(400).json({ status: 'error', message: 'ID de carrito no válido' });
    }

    try {
        const cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        }

        cart.products = [];
        await cart.save();

        res.json({ status: 'success', message: 'Todos los productos eliminados del carrito' });
    } catch (error) {
        console.error('Error al eliminar todos los productos del carrito:', error);
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// GET api/carts/:cid - Obtener un carrito con sus productos (usando populate)
router.get('/:cid', async (req, res) => {
    const { cid } = req.params;

    // Validar cid
    if (!isValidObjectId(cid)) {
        return res.status(400).json({ status: 'error', message: 'ID de carrito no válido' });
    }

    try {
        const cart = await Cart.findById(cid).populate('products.productId');
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        }

        res.json({ status: 'success', cart });
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        res.status(500).json({ status: 'error', message: error.message });
    }
});

export default router;
