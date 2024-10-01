import { Router } from 'express';
import Cart from '../models/Cart.js';
import Product from '../models/Products.js';

const router = Router();

// Agregar un producto al carrito
router.post('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;

        // Buscar el carrito por ID
        const cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(404).send('Carrito no encontrado');
        }

        // Buscar el producto por ID
        const product = await Product.findById(pid);
        if (!product) {
            return res.status(404).send('Producto no encontrado');
        }

        // Agregar el producto al carrito
        const existingProduct = cart.products.find(p => p.product.toString() === pid);
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.products.push({ product: pid, quantity: 1 });
        }
        await cart.save();

        res.status(200).send('Producto agregado al carrito');
    } catch (error) {
        res.status(500).send('Error al agregar el producto al carrito');
    }
});

// Eliminar un producto del carrito
router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;

        // Buscar el carrito por ID
        const cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(404).send('Carrito no encontrado');
        }

        // Eliminar el producto del carrito
        cart.products = cart.products.filter(p => p.product.toString() !== pid);
        await cart.save();

        res.status(200).send('Producto eliminado del carrito');
    } catch (error) {
        res.status(500).send('Error al eliminar el producto del carrito');
    }
});

// Actualizar el carrito con un arreglo de productos
router.put('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const { products } = req.body;

        // Buscar el carrito por ID
        const cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(404).send('Carrito no encontrado');
        }

        cart.products = products.map(product => ({
            product: product.id,
            quantity: product.quantity,
        }));
        await cart.save();

        res.status(200).send('Carrito actualizado');
    } catch (error) {
        res.status(500).send('Error al actualizar el carrito');
    }
});

// Actualizar la cantidad de ejemplares de un producto en el carrito
router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        // Buscar el carrito por ID
        const cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(404).send('Carrito no encontrado');
        }

        // Buscar el producto en el carrito
        const productInCart = cart.products.find(p => p.product.toString() === pid);
        if (!productInCart) {
            return res.status(404).send('Producto no encontrado en el carrito');
        }

        productInCart.quantity = quantity;
        await cart.save();

        res.status(200).send('Cantidad actualizada');
    } catch (error) {
        res.status(500).send('Error al actualizar la cantidad del producto');
    }
});

// Eliminar todos los productos del carrito
router.delete('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;

        // Buscar el carrito por ID
        const cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(404).send('Carrito no encontrado');
        }

        cart.products = [];
        await cart.save();

        res.status(200).send('Todos los productos eliminados del carrito');
    } catch (error) {
        res.status(500).send('Error al eliminar productos del carrito');
    }
});

// Obtener todos los productos del carrito con detalles
router.get('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;

        // Buscar el carrito por ID y hacer populate
        const cart = await Cart.findById(cid).populate('products.product');
        if (!cart) {
            return res.status(404).send('Carrito no encontrado');
        }

        res.json(cart.products);
    } catch (error) {
        res.status(500).send('Error al obtener productos del carrito');
    }
});

export default router;
