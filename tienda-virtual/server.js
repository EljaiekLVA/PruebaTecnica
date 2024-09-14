const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Crear la aplicación de Express
const app = express();

// Middleware para habilitar CORS (Cross-Origin Resource Sharing)
app.use(cors());
app.use(express.json());  // Middleware para manejar datos en formato JSON

// Servir archivos estáticos desde la raíz del proyecto
app.use(express.static(path.join(__dirname, '../')));

// Rutas para servir las páginas HTML

// Ruta para la página principal (index.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'view', 'index.html'));
});

// Ruta para la página de detalles del producto (detail.html)
app.get('/detail.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'view', 'detail.html'));
});

// Ruta para el carrito (cart.html)
app.get('/cart.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'view', 'cart.html'));
});

// Ruta para la página de resultados (results.html)
app.get('/results.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'view', 'results.html'));
});

// Rutas para servir archivos CSS y JavaScript
app.use('/css', express.static(path.join(__dirname, 'tienda-virtual', 'css')));
app.use('/Js', express.static(path.join(__dirname, 'tienda-virtual', 'Js')));

// Conectar a MongoDB
mongoose.connect('mongodb://localhost:27017/tienda', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error al conectar a MongoDB:', err));

// Definir el esquema de productos para MongoDB
const productSchema = new mongoose.Schema({
  id: Number,
  title: String,
  description: String,
  price: Number,
  discountPercentage: Number,
  rating: Number,
  stock: Number,
  brand: String,
  category: String,
  thumbnail: String,
  images: [String]
});

// Crear el modelo de producto basado en el esquema
const Product = mongoose.model('Product', productSchema);

// Ruta para obtener todos los productos de la base de datos
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find(); // Consultar todos los productos
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener productos' });
  }
});

// Endpoint para buscar productos por el título (filtro de búsqueda)
app.get('/api/items', async (req, res) => {
  try {
    const query = req.query.q; // Obtener la consulta de búsqueda
    const products = await Product.find({ title: new RegExp(query, 'i') }); // Búsqueda insensible a mayúsculas/minúsculas
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Endpoint para obtener el detalle de un producto específico por su ID
app.get('/api/items/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id); // Buscar el producto por ID
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Puerto en el que escucha el servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
