const express = require('express');
const {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct
} = require('../controller/productController');

const { protect } = require('../middleware/authMiddleware');
const roleAccess = require('../middleware/roleAccess');

const router = express.Router();

router.post('/', protect, roleAccess(['admin']), createProduct);
router.put('/:id', protect, roleAccess(['admin']), updateProduct);
router.delete('/:id', protect, roleAccess(['admin']), deleteProduct);
router.get('/', protect, roleAccess(['admin', 'customer']), getAllProducts);

module.exports = router;
