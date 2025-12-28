const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes')


// --- Middlewares ---
// Mengamankan header HTTP
app.use(helmet());

// Mengizinkan request dari frontend (CORS)
app.use(cors());

// Parsing body request (agar bisa baca JSON dari frontend)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging request ke terminal (hanya di mode dev)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// --- Routes Dasar (Check) ---
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Ecommerce API v1',
    status: 'success',
    server_time: new Date()
  });
});

app.use('/api/products', productRoutes);

app.use('/api/auth', authRoutes);

app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes)

// --- Error Handling (404 & 500) ---
// Handle URL yang tidak ditemukan
app.use((req, res, next) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found'
  });
});

// Handle Error Server
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Internal Server Error'
  });
});

// --- Server Listen ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});