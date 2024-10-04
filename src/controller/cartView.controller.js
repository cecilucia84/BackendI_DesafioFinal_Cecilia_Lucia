import CartRepository from '../services/CartManager.js';

export default class Controller {

    #cartRepository

    constructor() {
        this.#cartRepository = new CartRepository();
    }

    async getCartById(req, res) {
        try {

            const id = req.params.cid;
            const cart = await this.#cartRepository.getCartById(id); // Obtiene el carrito por su ID

            const cartData = {
                id: cart.id,
                products: cart.products.map(p => ({
                    productId: p.product.id,
                    title: p.product.title,
                    code: p.product.code,
                    quantity: p.quantity
                }))
            };

            res.status(200).render('cart', {
                cart: cartData,
                titlePage: 'Carrito',
                style: ['styles.css'],
                script: ['scripts.js'],
            }); // Responde con el carrito obtenido

        } catch (error) {
            res.status(500).json({ error });
        }
    }
}