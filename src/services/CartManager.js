import CartDAO from '../dao/carts.dao.js';
import ProductRepository from './ProductManager.js';

export default class CartRepository {

  #cartDAO;
  #productRepository;

  constructor() {
    this.#cartDAO = new CartDAO();
    this.#productRepository = new ProductRepository();
  };

  async #verifyCartExists(cartId) {
    try {
      const cart = await this.#cartDAO.getCartById(cartId);

      return cart;

    } catch {
      throw new Error('cartID inválido');
    };
  };

  async #verifyProductExists(productId) {
    try {
      const product = await this.#productRepository.getProductById(productId);

      return product;

    } catch {
      throw new Error('productID inválido');
    };
  };

  async getCarts() {
    try {
      return await this.#cartDAO.getCarts();

    } catch {
      throw new Error('Error con el carrito');
    };
  };

  async getCartById(id) {
    try {
      let cart = await this.#verifyCartExists(id);

      // Se verifica que no se hayan eliminado de la DB los productos cargados en el carrito
      const updatedCart = cart.products.filter(i => i.product !== null);
      if (updatedCart.lenght !== cart.products.length) {
        cart.products = updatedCart;
        await this.#cartDAO.updateCart(id, { products: cart.products });
      };

      return cart;

    } catch (error) {
      throw new Error({
        name: error.name || 'Error con el carrito',
      });
    };
  };

  async addCart() {
    try {
      const cart = { products: [] };

      return await this.#cartDAO.addCart(cart);

    } catch (error) {
      throw new Error({
        name: error.name || 'Error con el carrito',
      });
    };
  };

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
    };

    // Guardar el carrito actualizado
    await this.#cartDAO.updateCart(cartId, { products: cart.products });

    return cart;
  };

  async deleteProductFromCart(productId, cartId) {
    try {
      await this.#verifyProductExists(productId);
      await this.#verifyCartExists(cartId);
      await this.#cartDAO.updateCart(cartId, { products: { product: productId } }, '$pull');
      const cart = this.getCartById(cartId);

      return cart;

    } catch (error) {
      throw new Error({
        name: error.name || 'Error con el carrito',
      });
    };
  };

  async updateCart(cartId, products) {
    try {
      const cart = await this.#verifyCartExists(cartId);

      // Iterar sobre cada producto en el arreglo de productos
      for (const { product: productId, quantity } of products) {
        await this.#verifyProductExists(productId);

        if (quantity < 1 || isNaN(quantity)) {
          throw new Error('Error en la petición');
        };

        // Verificar si el producto ya está en el carrito
        const existingProductIndex = cart.products.findIndex(p => p.product.equals(productId));

        if (existingProductIndex !== -1) {
          // Si el producto ya está en el carrito, actualizar la cantidad
          cart.products[existingProductIndex].quantity += quantity;

        } else {
          // Si el producto no está en el carrito, agregarlo
          cart.products.push({ product: productId, quantity });
        };
      };

      // Guardar los cambios en el carrito utilizando el DAO
      await this.#cartDAO.updateCart(cartId, { products: cart.products });

      const updatedCart = await this.#cartDAO.getCartById(cartId);

      return updatedCart;

    } catch (error) {
      throw new Error({
        name: error.name || 'Error con el carrito',
      });
    };
  };

  async updateProductQuantity(cartId, productId, quantity) {
    try {
      await this.#verifyProductExists(productId);
      const cart = await this.#verifyCartExists(cartId);

      if (quantity < 0 || isNaN(quantity)) {
        throw new Error('Cantidad inválida');
      };

      const existingProductIndex = cart.products.findIndex(p => p.product.equals(productId));

      if (existingProductIndex !== -1) {
        cart.products[existingProductIndex].quantity = quantity;
        await this.#cartDAO.updateCart(cartId, { products: cart.products });
      };

      return cart;

    } catch (error) {
      throw new Error({
        name: error.name || 'Error con el carrito',
      });
    };
  };

  async clearCart(cartId) {
    try {
      const cart = await this.#verifyCartExists(cartId);
      await this.#cartDAO.updateCart(cartId, { products: [] });

      return cart;

    } catch (error) {
      throw new Error({
        name: error.name || 'Error con el carrito',
      });
    };
  };
};