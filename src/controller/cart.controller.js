import CartService from '../services/CartManager.js';

export default class Controller {

    #cartService;

    constructor() {
        this.#cartService = new CartService();
    };

    async getCarts(res) {
        try {
            const carts = await this.#cartService.getCarts();

            res.status(200).json(carts);

        } catch (error) {
            res.status(500).json({ error });
        };
    };

    async getCartById(req, res) {
        try {
            const cartId = req.params.cid;
            const cart = await this.#cartService.getCartById(cartId);

            res.status(200).json(cart);

        } catch (error) {
            res.status(500).json({ error });
        };
    };

    async createCart(req, res) {
        try {
            const cart = await this.#cartService.addCart();

            res.status(201).json(cart);

        } catch (error) {
            res.status(500).json({ error });
        };
    };

    async addProductToCart(req, res) {
        try {
            const cartId = req.params.cid;
            const productId = req.params.pid;
            const user = req.user;
            const cart = await this.#cartService.addProductToCart(productId, cartId, user);

            res.status(200).json(cart);

        } catch (error) {
            res.status(500).json({ error });
        };
    };

    async deleteProductFromCart(req, res) {
        try {
            const cartId = req.params.cid;
            const productId = req.params.pid
            const cart = await this.#cartService.deleteProductFromCart(productId, cartId);

            res.status(200).json(cart);

        } catch (error) {
            res.status(500).json({ error });
        };
    };

    async updateCart(req, res) {
        try {
            const cartId = req.params.cid;
            const products = req.body;
            const cart = await this.#cartService.updateCart(cartId, products);

            res.status(200).json(cart);

        } catch (error) {
            res.status(500).json({ error });
        };
    };

    async updateProductQuantity(req, res) {
        try {
            const cartId = req.params.cid;
            const productId = req.params.pid;
            const { quantity } = req.body;
            const cart = await this.#cartService.updateProductQuantity(cartId, productId, quantity);

            res.status(200).json(cart);

        } catch (error) {
            res.status(500).json({ error });
        };
    };

    async clearCart(req, res) {
        try {
            const cartId = req.params.cid;
            const cart = await this.#cartService.clearCart(cartId);

            res.status(204).json(cart);

        } catch (error) {
            res.status(500).json({ error });
        };
    };
};