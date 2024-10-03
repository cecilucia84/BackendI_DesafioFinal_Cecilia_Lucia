import CartDAO from '../dao/carts.dao.js';
import ProductRepository from './ProductManager.js';

export default class CartRepository {
    #cartDAO;
    #productRepository;

    constructor() {
        this.#cartDAO = new CartDAO();
        this.#productRepository = new ProductRepository();
    }

    async #verifyCartExists(cartId) {
        const cart = await this.#cartDAO.getCartById(cartId);
        if (!cart) {
            throw new Error({
                name: 'ID de carrito inválido',
                status: 404
            });
        }
        return cart;
    }

    async #verifyProductExists(productId) {
        const product = await this.#productRepository.getProductById(productId);
        if (!product) {
            throw new Error({
                name: 'ID de producto inválido',
                status: 404
            });
        }
        return product;
    }

    async getCarts() {
        try {
            return await this.#cartDAO.getCarts();
        } catch {
            throw new Error({
                name: 'Error al obtener los carritos',
                status: 500
            });
        }
    }

    async getCartById(id) {
        const cart = await this.#verifyCartExists(id);

        // Se verifica que no se hayan eliminado de la DB los productos cargados en el carrito
        const updatedCart = cart.products.filter(i => i.product !== null);
        if (updatedCart.length !== cart.products.length) {
            cart.products = updatedCart;
            await this.#cartDAO.updateCart(id, { products: cart.products });
        }

        return cart;
    }

    async addCart() {
        try {
            const cart = { products: [] };
            return await this.#cartDAO.addCart(cart);
        } catch (error) {
            throw new Error({
                name: error.name || 'Error al crear el carrito',
                status: error.status || 500
            });
        }
    }

    async addProductToCart(productId, cartId, user) {
        await this.#verifyProductExists(productId);
        const cart = await this.#verifyCartExists(cartId);

        // Verificar si el producto ya está en el carrito
        const existingProductIndex = cart.products.findIndex(p => p.product.equals(productId));

        if (existingProductIndex !== -1) {
            // Si el producto existe, aumentar su cantidad en 1
            cart.products[existingProductIndex].quantity += 1;
        } else {
            // Si el producto no existe, agregarlo al carrito con cantidad 1
            cart.products.push({ product: productId, quantity: 1 });
        }

        // Guardar el carrito actualizado
        await this.#cartDAO.updateCart(cartId, { products: cart.products });
        return cart;
    }

    async deleteProductFromCart(productId, cartId) {
        await this.#verifyProductExists(productId);
        const cart = await this.#verifyCartExists(cartId);

        // Filtrar el producto a eliminar
        const initialLength = cart.products.length; // Obtener la longitud inicial
        cart.products = cart.products.filter(p => !p.product.equals(productId));

        // Solo actualizar si el producto fue realmente eliminado
        if (cart.products.length < initialLength) {
            // Actualizar el carrito en la base de datos
            await this.#cartDAO.updateCart(cartId, { products: cart.products });
        }

        return cart; // Devolver el carrito actualizado
    }

    async updateCart(cartId, products) {
        const cart = await this.#verifyCartExists(cartId);

        // Iterar sobre cada producto en el arreglo de productos
        for (const { product: productId, quantity } of products) {
            await this.#verifyProductExists(productId);

            if (quantity < 1 || isNaN(quantity)) {
                throw new Error({
                    name: 'Cantidad inválida',
                    status: 400
                });
            }

            // Verificar si el producto ya está en el carrito
            const existingProductIndex = cart.products.findIndex(p => p.product.equals(productId));

            if (existingProductIndex !== -1) {
                // Si el producto ya está en el carrito, actualizar la cantidad
                cart.products[existingProductIndex].quantity += quantity;
            } else {
                // Si el producto no está en el carrito, agregarlo
                cart.products.push({ product: productId, quantity });
            }
        }

        // Guardar los cambios en el carrito utilizando el DAO
        await this.#cartDAO.updateCart(cartId, { products: cart.products });
        const updatedCart = await this.#cartDAO.getCartById(cartId);
        return updatedCart;
    }

    async updateProductQuantity(cartId, productId, quantity) {
        await this.#verifyProductExists(productId);
        const cart = await this.#verifyCartExists(cartId);

        if (quantity < 0 || isNaN(quantity)) {
            throw new Error({
                name: 'Cantidad inválida',
                status: 400
            });
        }

        const existingProductIndex = cart.products.findIndex(p => p.product.equals(productId));

        if (existingProductIndex !== -1) {
            cart.products[existingProductIndex].quantity = quantity;
            await this.#cartDAO.updateCart(cartId, { products: cart.products });
        }

        return cart;
    }

    async clearCart(cartId) {
        const cart = await this.#verifyCartExists(cartId);
        cart.products = []; // Vaciar el arreglo de productos
        await this.#cartDAO.updateCart(cartId, { products: cart.products });

        return cart; // Devolver el carrito vaciado
    }
}
