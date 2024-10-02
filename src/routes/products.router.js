// src/routes/products.router.js

import { Router } from 'express'; 
import Product from '../models/Products.js'; // Asegúrate de que este modelo esté definido correctamente

const router = Router();

// Obtener todos los productos (ruta corregida)
router.get('/', async (req, res) => { // Cambiado de '/products' a '/'
  try {
    // Parámetros por defecto y de query
    const { limit = 10, page = 1, sort, query } = req.query;

    // Filtrado basado en 'query', puede buscar por categoría o disponibilidad
    let filter = {};
    if (query) {
      filter = { $or: [{ category: query }, { availability: query }] }; // Filtra por categoría o disponibilidad
    }

    // Log para depuración
    console.log('Filter:', filter); // Log para ver el filtro aplicado

    // Ordenamiento basado en el parámetro 'sort'
    let sortOptions = {};
    if (sort) {
      sortOptions.price = sort === 'asc' ? 1 : -1; // Orden ascendente o descendente por precio
    }

    // Paginación y búsqueda en la base de datos
    const options = {
      limit: parseInt(limit),
      page: parseInt(page),
      sort: sortOptions
    };

    // Asegúrate de que el plugin de paginación esté configurado en el modelo Product
    const products = await Product.paginate(filter, options); // Usar método paginate para facilitar la paginación

    // Creación de los enlaces para la paginación
    const prevLink = products.hasPrevPage ? `/api/products?limit=${limit}&page=${products.prevPage}&sort=${sort}&query=${query}` : null;
    const nextLink = products.hasNextPage ? `/api/products?limit=${limit}&page=${products.nextPage}&sort=${sort}&query=${query}` : null;

    // Formato de respuesta
    res.json({
      status: 'success',
      payload: products.docs, // Resultado de los productos solicitados
      totalPages: products.totalPages,
      prevPage: products.prevPage,
      nextPage: products.nextPage,
      page: products.page,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      prevLink,
      nextLink
    });
  } catch (error) {
    console.error('Error al obtener productos:', error); // Agregar log para depuración
    res.status(500).json({ status: 'error', message: error.message });
  }
});

export default router;
