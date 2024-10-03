import { Carts } from '../models/index.js';

export default class CartDAO {
    async getCarts() {
        try {
            return await Carts.find() || [];
        } catch (error) {
            throw new Error({
                name: 'Error al obtener los carritos',
                status: 500,
                details: error.message // Agregar detalles del error
            });
        }
    };

    async getCartById(id) {
        try {
            const cart = await Carts.findOne({ _id: id }).populate('products.product');
            if (!cart) {
                throw new Error({ name: 'El carrito no existe', status: 404 });
            }
            return cart;
        } catch (error) {
            throw new Error({
                name: error.name || 'Error al obtener el carrito',
                status: error.status || 500,
                details: error.message
            });
        }
    };

    async addCart(cart) {
        try {
            return await Carts.create(cart);
        } catch (error) {
            throw new Error({
                name: 'Error al agregar el carrito',
                status: 500,
                details: error.message
            });
        }
    };

    async updateCart(id, data, action = '$set') {
        try {
            const updateData = { [action]: data };
            const result = await Carts.updateOne({ _id: id }, updateData);
            if (result.modifiedCount === 0) {
                throw new Error({ name: 'El carrito no se encontró o no se actualizó', status: 404 });
            }
            return result;
        } catch (error) {
            throw new Error({
                name: 'Error al actualizar el carrito',
                status: 500,
                details: error.message
            });
        }
    };

    async deleteCart(id) {
        try {
            const result = await Carts.deleteOne({ _id: id });
            if (result.deletedCount === 0) {
                throw new Error({ name: 'El carrito no existe', status: 404 });
            }
            return result;
        } catch (error) {
            throw new Error({
                name: 'Error al eliminar el carrito',
                status: 500,
                details: error.message
            });
        }
    };
}
