// src/models/Products.js

import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

// Definir el esquema del producto
const productSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Hacer que el título sea obligatorio
  description: { type: String, required: true }, // Hacer que la descripción sea obligatoria
  code: { type: String, required: true, unique: true }, // Hacer que el código sea único y obligatorio
  price: { type: Number, required: true, min: 0 }, // Hacer que el precio sea obligatorio y no negativo
  stock: { type: Number, required: true, min: 0 }, // Hacer que el stock sea obligatorio y no negativo
  category: { type: String, required: true }, // Hacer que la categoría sea obligatoria
  thumbnails: { type: [String], default: [] }, // Inicializar thumbnails como un array vacío por defecto
  status: { type: Boolean, default: true } // Estado por defecto verdadero
});

// Agregar el plugin de paginación
productSchema.plugin(mongoosePaginate);

// Crear el modelo a partir del esquema
const Product = mongoose.model('Product', productSchema);

// Exportar el modelo
export default Product;
