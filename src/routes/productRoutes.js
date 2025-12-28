const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware'); // Import Satpam

router.post('/', authMiddleware, productController.createProduct); 
router.get('/', productController.getAllProducts); // Kalau GET biarkan public

module.exports = router;