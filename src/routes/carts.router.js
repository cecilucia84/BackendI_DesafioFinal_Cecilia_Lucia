import { Router } from 'express';
import Cart from '../models/Cart.js'; // Asegúrate de que la ruta sea correcta

const router = Router();

// DELETE api/carts/:cid/products/:pid
router.delete('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;

    try {
        const cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        }

        // Filtra y elimina el producto
        cart.products = cart.products.filter(product => product.productId.toString() !== pid);
        await cart.save();
        res.json({ status: 'success', message: 'Producto eliminado del carrito' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// PUT api/carts/:cid
router.put('/:cid', async (req, res) => {
    const { cid } = req.params;
    const { products } = req.body; // Debería recibir un arreglo de productos

    try {
        const cart = await Cart.findByIdAndUpdate(cid, { products }, { new: true });
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        }
        res.json({ status: 'success', message: 'Carrito actualizado', cart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// PUT api/carts/:cid/products/:pid
router.put('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    try {
        const cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        }

        const productIndex = cart.products.findIndex(product => product.productId.toString() === pid);

        if (productIndex > -1) {
            cart.products[productIndex].quantity = quantity; // Actualiza la cantidad de un producto
            await cart.save();
            res.json({ status: 'success', message: 'Cantidad de producto actualizada', cart });
        } else {
            res.status(404).json({ status: 'error', message: 'Producto no encontrado en el carrito' });
        }
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// DELETE api/carts/:cid
router.delete('/:cid', async (req, res) => {
    const { cid } = req.params;

    try {
        const cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        }

        cart.products = []; // Elimina todos los productos del carrito
        await cart.save();
        res.json({ status: 'success', message: 'Todos los productos eliminados del carrito' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// GET api/carts/:cid (con populate)
router.get('/:cid', async (req, res) => {
    const { cid } = req.params;

    try {
        const cart = await Cart.findById(cid).populate('products.productId'); // Popula los productos del carrito
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        }
        res.json({ status: 'success', cart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

export default router; // Exporta el router
