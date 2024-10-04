import ProductDAO from '../dao/products.dao.js';

export default class ProductRepository {

  #productDAO

  constructor() {
    this.#productDAO = new ProductDAO();
  };

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

      
      if (isNaN(page)) {
        throw new Error("Error de paginado.");
      };

      
      const products = await this.#productDAO.getPaginateProducts(query, options);

      if (!products || !products.docs.length) {
        return [];
      };

    
      if (page > products.totalPages) {
        throw new Error("Error de paginado.");
      };

     
      return products;

    } catch (error) {
    
      throw new Error({
        name: error.name || 'Error al conectar',
      });
    };
  };

  async getProductById(id) {
    try {
      const product = await this.#productDAO.getProductById(id);

      return product;

    } catch {
      throw new Error('El producto no existe');
    };
  };

  async addProduct(productData) {
    try {
      const { title, description, price, thumbnail, code, stock, category } = productData;

      
      const invalidOptions = isNaN(+price) || +price <= 0 || isNaN(+stock) || +stock < 0;

      if (!title || !description || !code || !category || invalidOptions) {
        throw new Error('Error al agregar el producto');
      };

      const finalThumbnail = thumbnail ? `../products/${thumbnail.originalname}` : 'Sin Imagen';
      const finalStatus = stock >= 1 ? true : false;

      
      const existingCode = await this.#productDAO.findByCode(code);
      if (existingCode) {
        throw new Error('Error al agregar el producto');
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
      });
    };
  };

  async updateProduct(id, productData) {
    try {
      await this.getProductById(id);

      
      const areFieldsPresent = Object.keys(productData).length > 0;
      if (!areFieldsPresent) {
        throw new Error('Campos inválidos');
      };

      await this.#productDAO.updateProduct(id, productData);

      const updatedProduct = await this.#productDAO.getProductById(id);

      return updatedProduct;

    } catch (error) {
      throw new Error({
        name: error.name || 'Error al actualizar',
      });
    };
  };

  async deleteProduct(productId) {
    try {
      const product = await this.getProductById(productId);

      if (!product) {
        throw new Error('El producto no existe.');
      };

      return await this.#productDAO.deleteProduct(productId);

    } catch (error) {
      throw new Error({
        name: error.name || 'Error al actualizar',
      });
    };
  };
};