import ProductRepository from '../services/ProductManager.js';
import CartRepository from '../services/CartManager.js';

export default class Controller {
    constructor() {
        this.productRepository = new ProductRepository();
    }

    async getProducts(req, res) {
        try {
            const page = req.query.page || 1;
            const limit = req.query.limit || 10;
            const sort = req.query.sort;
            const category = req.query.category;
            const availability = req.query.availability;

            const products = await this.productRepository.getProducts(page, limit, sort, category, availability);

            const productsPayload = products.docs.map(product => ({
                ...product,
            }));

            res.render('products', {
                products: { ...products, payload: productsPayload },
                titlePage: 'Productos',
                style: ['styles.css'],
            });

        } catch (error) {
            res.status(500).json({ error });
        }
    }

    async getProductById(req, res) {
        try {
            const productId = req.params.pid;
            const product = await this.productRepository.getProductById(productId);

            const productData = {
                title: product.title,
                thumbnail: product.thumbnail,
                description: product.description,
                price: product.price,
                stock: product.stock,
                code: product.code,
                id: product.id,
            };

            res.status(200).render('product', {
                product: [productData],
                titlePage: `Productos | ${product.title}`,
                style: ['styles.css'],
            });
        } catch (error) {
            res.status(500).json({ error });
        }
    }

    async addProductToCart(req, res) {
        try {
            const productId = req.params.pid;
            const cartId = req.user.cart;
            await new CartRepository().addProductToCart(productId, cartId);
            res.status(301).redirect('/products');
        } catch (error) {
            res.status(500).json({ error });
        }
    }

    async addProduct(req, res) {
        try {
            const { title, description, price, thumbnail, code, status, stock, category } = req.body;
            const owner = req.user.email;
            await this.productRepository.addProduct({ title, description, price, thumbnail, code, status, stock, category, owner });
            res.status(301).redirect('/products');
        } catch (error) {
            res.status(500).json({ error });
        }
    }
}