import { Router } from 'express';
import Product from '../models/Products.js';

const router = Router();


router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const products = await Product.paginate({}, { page, limit });

    res.render('index', {
      products: products.docs,
      pagination: products.pagination,
      hasNextPage: products.hasNextPage,
      hasPrevPage: products.hasPrevPage,
      nextPage: products.nextPage,
      prevPage: products.prevPage,
    });
  } catch (error) {
    console.error('Error al renderizar la vista principal', error);
    res.status(500).send('Error al cargar productos');
  }
});


router.get('/product/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send('Producto no encontrado');
    }

    res.render('productDetail', { product });
  } catch (error) {
    console.error('Error al cargar el producto', error);
    res.status(500).send('Error al cargar el producto');
  }
});

export default router;
