import { Router } from 'express';
import Product from '../models/Products.js';

const router = Router();

// Endpoint para obtener productos con paginación, filtros y ordenamiento
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, sort, category, query } = req.query;
    
    // Filtro básico para categoría
    const filter = {};
    if (category) filter.category = category;
    if (query) filter.title = { $regex: query, $options: 'i' }; // Filtro por nombre de producto

    // Configurar ordenamiento
    const sortQuery = {};
    if (sort === 'asc') sortQuery.price = 1; // Orden ascendente
    if (sort === 'desc') sortQuery.price = -1; // Orden descendente

    // Aplicar paginación, filtros y ordenamiento
    const products = await Product.find(filter)
      .sort(sortQuery)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    // Contar el total de productos para paginación
    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limit);

    // Construir el objeto de respuesta
    const response = {
      status: 'success',
      payload: products,
      totalPages,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null,
      page,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
      prevLink: page > 1 ? `/products?page=${page - 1}&limit=${limit}&sort=${sort}` : null,
      nextLink: page < totalPages ? `/products?page=${page + 1}&limit=${limit}&sort=${sort}` : null,
    };

    res.json(response);
  } catch (error) {
    console.error('Error al obtener productos', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// Crear un nuevo producto
router.post('/', async (req, res) => {
  try {
    const { title, description, code, price, stock, category, thumbnails } = req.body;

    // Validar campos requeridos
    if (!title || !description || !code || !price || !stock || !category) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    // Crear un nuevo producto
    const newProduct = new Product({ title, description, code, price, stock, category, thumbnails });
    await newProduct.save();

    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error al crear producto', error);
    res.status(500).json({ error: 'Error al crear el producto' });
  }
});

export default router;
