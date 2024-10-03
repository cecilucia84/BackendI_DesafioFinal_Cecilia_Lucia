import CartService from '../services/CartManager.js';

export default class Controller {
    #cartService;

    constructor() {
        this.#cartService = new CartService();
    }

    async getCarts(req, res) {
        try {
            const carts = await this.#cartService.getCarts();
            res.status(200).json(carts);
        } catch (error) {
            res.status(error.status || 500).json({ error: error.message || 'Error al obtener los carritos' });
        }
    }

    async getCartById(req, res) {
        try {
            const cartId = req.params.cid;
            const cart = await this.#cartService.getCartById(cartId);

            if (!cart) {
                return res.status(404).json({ error: 'Carrito no encontrado' });
            }

            res.status(200).json(cart);
        } catch (error) {
            res.status(error.status || 500).json({ error: error.message || 'Error al obtener el carrito' });
        }
    }

    async createCart(req, res) {
        try {
            const cart = await this.#cartService.addCart();
            res.status(201).json(cart);
        } catch (error) {
            res.status(error.status || 500).json({ error: error.message || 'Error al crear el carrito' });
        }
    }

    async addProductToCart(req, res) {
        try {
            const cartId = req.params.cid;
            const productId = req.params.pid;
            const user = req.user; // Suponiendo que tienes información del usuario
            const cart = await this.#cartService.addProductToCart(productId, cartId, user);
            res.status(200).json(cart);
        } catch (error) {
            res.status(error.status || 500).json({ error: error.message || 'Error al agregar producto al carrito' });
        }
    }

    async deleteProductFromCart(req, res) {
        try {
            const cartId = req.params.cid;
            const productId = req.params.pid;
            const cart = await this.#cartService.deleteProductFromCart(productId, cartId);

            // Comprobar si el carrito tiene productos
            if (!cart || cart.products.length === 0) {
                return res.status(404).json({ error: 'No hay productos en el carrito o producto no encontrado' });
            }

            res.status(200).json(cart);
        } catch (error) {
            res.status(error.status || 500).json({ error: error.message || 'Error al eliminar producto del carrito' });
        }
    }

    async clearCart(req, res) {
        try {
            const cartId = req.params.cid;
            const cart = await this.#cartService.clearCart(cartId); // Asegúrate de que este método vacíe el carrito

            res.status(200).json({ message: 'Carrito vaciado con éxito', cart }); // Mensaje de éxito
        } catch (error) {
            res.status(error.status || 500).json({ error: error.message || 'Error al vaciar el carrito' });
        }
    }
}
