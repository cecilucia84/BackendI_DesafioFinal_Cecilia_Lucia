import { Products } from '../models/index.js';

export default class ProductDAO {
    async getPaginateProducts(query, options) {
        try {
            const products = await Products.paginate(query, options);
            return products || { docs: [], totalPages: 0, currentPage: 0 }; 
        } catch (error) {
            throw new Error({
                name: 'Error al obtener productos paginados',
                status: 500,
                details: error.message 
            });
        }
    }

    async getProducts() {
        try {
            const products = await Products.find();
            return products || [];
        } catch (error) {
            throw new Error({
                name: 'Error al obtener productos',
                status: 500,
                details: error.message
            });
        }
    }

    async getProductById(id) {
        try {
            const product = await Products.findById(id);
            if (!product) {
                throw new Error({ name: 'El producto no existe', status: 404 });
            }
            return product;
        } catch (error) {
            throw new Error({
                name: error.name || 'Error al obtener el producto',
                status: error.status || 500,
                details: error.message
            });
        }
    }

    async addProduct(product) {
        try {
            return await Products.create(product);
        } catch (error) {
            throw new Error({
                name: 'Error al agregar el producto',
                status: 500,
                details: error.message
            });
        }
    }

    async updateProduct(id, product) {
        try {
            const result = await Products.updateOne({ _id: id }, { $set: product });
            if (result.modifiedCount === 0) {
                throw new Error({ name: 'El producto no se encontró o no se actualizó', status: 404 });
            }
            return result;
        } catch (error) {
            throw new Error({
                name: 'Error al actualizar el producto',
                status: 500,
                details: error.message
            });
        }
    }

    async deleteProduct(id) {
        try {
            const result = await Products.deleteOne({ _id: id });
            if (result.deletedCount === 0) {
                throw new Error({ name: 'El producto no existe', status: 404 });
            }
            return result;
        } catch (error) {
            throw new Error({
                name: 'Error al eliminar el producto',
                status: 500,
                details: error.message
            });
        }
    }

    async findByCode(code) {
        try {
            return await Products.findOne({ code });
        } catch (error) {
            throw new Error({
                name: 'Error al buscar producto por código',
                status: 500,
                details: error.message
            });
        }
    }
}
