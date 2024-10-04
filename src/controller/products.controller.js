import ProductService from '../services/ProductManager.js';

export default class Controller {
    #productService;

    constructor() {
        this.#productService = new ProductService();
    };

    async getProducts(req, res) {
        try {
 
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const sort = req.query.sort; // 'asc' o 'desc'
            const query = req.query.query; // 

          
            const options = {
                limit,
                skip: (page - 1) * limit,
                sort: sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : {}
            };

            const match = {};
            if (query) {
     
                match.$or = [
                    { title: new RegExp(query, 'i') }, // 
                    { category: new RegExp(query, 'i') } //
                ];
            }

          
            const products = await this.#productService.getProducts(options, match);
            const total = await this.#productService.countProducts(match); // 

          
            const totalPages = Math.ceil(total / limit);

         
            const response = {
                status: 'success',
                payload: products,
                totalPages,
                prevPage: page > 1 ? page - 1 : null,
                nextPage: page < totalPages ? page + 1 : null,
                page,
                hasPrevPage: page > 1,
                hasNextPage: page < totalPages,
                prevLink: page > 1 ? `/api/products?limit=${limit}&page=${page - 1}&sort=${sort}&query=${query}` : null,
                nextLink: page < totalPages ? `/api/products?limit=${limit}&page=${page + 1}&sort=${sort}&query=${query}` : null
            };

            res.status(200).json(response);

        } catch (error) {
            res.status(error.status || 500).json({ error: error.message });
        };
    };

    async getProductById(req, res) {
        try {
            const productId = req.params.pid;
            const product = await this.#productService.getProductById(productId);

            res.status(200).json(product);

        } catch (error) {
            res.status(error.status || 500).json({ error: error.message });
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
            res.status(error.status || 500).json({ error: error.message });
        };
    };

    async updateProduct(req, res) {
        try {
            const productId = req.params.pid;
            const updatedProduct = await this.#productService.updateProduct(productId, req.body);

            res.status(201).json(updatedProduct);

        } catch (error) {
            res.status(error.status || 500).json({ error: error.message });
        };
    };

    async deleteProduct(req, res) {
        try {
            const productId = req.params.pid;
            await this.#productService.deleteProduct(productId);

            res.status(204).json({ message: 'Producto eliminado' });

        } catch (error) {
            res.status(error.status || 500).json({ error: error.message });
        };
    };
};
