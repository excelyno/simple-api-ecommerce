const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.post('/', orderController.checkout);
router.get('/', orderController.getMyOrders);

router.put('/:orderId/pay', orderController.payOrder);

module.exports = router;