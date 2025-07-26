const express = require('express');
const {
  placeOrder,
  updateOrderStatus,
  getAllOrders,
  getOrderById
} = require('../controller/orderController');

const { protect } = require('../middleware/authMiddleware');
const roleAccess = require('../middleware/roleAccess');
const router = express.Router();

router.post('/', protect, roleAccess(['customer']), placeOrder);
router.get('/:id', protect, roleAccess(['customer']), getOrderById);
router.patch('/:id/status', protect, roleAccess(['admin']), updateOrderStatus);
router.get('/admin', protect, roleAccess(['admin']), getAllOrders);

module.exports = router;
