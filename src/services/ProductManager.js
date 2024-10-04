import ProductDAO from '../dao/products.dao.js';

export default class ProductRepository {
  #productDAO;

  constructor() {
    this.#productDAO = new ProductDAO();
  }

  async getProducts(page, limit, sort, category, availability) {
    try {
 
      const query = {
        ...(category && { category }),
        ...(availability && { status: availability === 'true' })
      };

      const options = {
        limit: limit ? parseInt(limit) : 10,
        page: parseInt(page),
        sort: sort ? { price: sort } : undefined,
        lean: true
      };

  
      if (isNaN(page) || page <= 0) {
        throw new Error({ status: 400, name: "Error de paginado." });
      }

     
      const products = await this.#productDAO.getPaginateProducts(query, options);

      if (!products || products.docs.length === 0) {
        return { products: [], totalPages: 0, currentPage: page };
      }

      if (page > products.totalPages) {
        throw new Error({ status: 400, name: "Error de paginado." });
      }

      
      return products;
      
    } catch (error) {
   
      throw new Error({
        name: error.name || 'Error al conectar',
        status: error.status || 500
      });
    }
  }

  async getProductById(id) {
    try {
      const product = await this.#productDAO.getProductById(id);
      if (!product) {
        throw new Error({ name: 'El producto no existe', status: 404 });
      }
      return product;
    } catch (error) {
      throw new Error({
        name: error.name || 'Error al obtener el producto',
        status: error.status || 500
      });
    }
  }

  async addProduct(productData) {
    try {
      const { title, description, price, thumbnail, code, stock, category } = productData;


      const invalidOptions = isNaN(+price) || +price <= 0 || isNaN(+stock) || +stock < 0;

      if (!title || !description || !code || !category || invalidOptions) {
        throw new Error({ status: 400, name: 'Error al agregar el producto' });
      }

      const finalThumbnail = thumbnail ? `../products/${thumbnail.originalname}` : 'Sin Imagen';
      const finalStatus = stock >= 1;

      const existingCode = await this.#productDAO.findByCode(code);
      if (existingCode) {
        throw new Error({ status: 409, name: 'El código ya existe, error al agregar el producto' });
      }

      const newProduct = {
        title,
        description,
        price,
        thumbnail: finalThumbnail,
        code,
        status: finalStatus,
        stock,
        category
      };


      const product = await this.#productDAO.addProduct(newProduct);
      return product;

    } catch (error) {
      throw new Error({
        name: error.name || 'Error al conectar',
        status: error.status || 500
      });
    }
  }

  async updateProduct(id, productData) {
    try {
      await this.getProductById(id);


      const areFieldsPresent = Object.keys(productData).length > 0;
      if (!areFieldsPresent) {
        throw new Error({
          name: 'Campos inválidos',
          status: 400
        });
      }

      if (productData.price && (isNaN(+productData.price) || +productData.price <= 0)) {
        throw new Error({ name: 'Precio inválido', status: 400 });
      }
      if (productData.stock && (isNaN(+productData.stock) || +productData.stock < 0)) {
        throw new Error({ name: 'Stock inválido', status: 400 });
      }

      await this.#productDAO.updateProduct(id, productData);

      const updatedProduct = await this.#productDAO.getProductById(id);
      return updatedProduct;

    } catch (error) {
      throw new Error({
        name: error.name || 'Error al actualizar el producto',
        status: error.status || 500
      });
    }
  }

  async deleteProduct(productId) {
    try {
      const product = await this.getProductById(productId);
      if (!product) {
        throw new Error({ status: 404, name: 'El producto no existe.' });
      }

      return await this.#productDAO.deleteProduct(productId);

    } catch (error) {
      throw new Error({
        name: error.name || 'Error al eliminar el producto',
        status: error.status || 500
      });
    }
  }
}
