import ProductService from '../services/ProductManager.js';

export default class Controller {

    #productService;

    constructor() {
        this.#productService = new ProductService();
    };

    async getProducts(req, res) {
        try {
            const page = req.query.page || 1;
            const limit = req.query.limit || 10;
            const sort = req.query.sort;
            const category = req.query.category;
            const availability = req.query.availability;

            const products = await this.#productService.getProducts(page, limit, sort, category, availability);

            res.status(200).json(products);

        } catch (error) {
            res.status(500).json({ error });
        };
    };

    async getProductById(req, res) {
        try {
            const productId = req.params.pid;
            const product = await this.#productService.getProductById(productId);

            res.status(200).json(product);

        } catch (error) {
            res.status(500).json({ error });
        };
    };

    async addProduct(req, res) {
        try {
            const { title, description, price, code, stock, category } = req.body;
            const owner = req.user.email;
            const thumbnail = req.file;
            const product = await this.#productService.addProduct({ title, description, price, thumbnail, code, stock, category, owner });

            res.status(201).json(product);

        } catch (error) {
            res.status(500).json({ error });
        };
    };

    async updateProduct(req, res) {
        try {
            const productId = req.params.pid;
            const updatedProduct = await this.#productService.updateProduct(productId, req.body);

            res.status(201).json(updatedProduct);

        } catch (error) {
            res.status(500).json({ error });
        };
    };

    async deleteProduct(req, res) {
        try {
            const productId = req.params.pid;
            await this.#productService.deleteProduct(productId);

            res.status(204).json({ message: 'Producto eliminado' });

        } catch (error) {
            res.status(500).json({ error });
        };
    };
};