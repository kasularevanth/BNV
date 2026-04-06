const router = require('express').Router();
const orderController = require('../controllers/orderController');
const { verifyToken } = require('../middleware/auth');
const { requireRole } = require('../middleware/roleCheck');
const { createOrderValidator, updateStatusValidator } = require('../validators/orderValidators');

router.get('/', verifyToken, orderController.getOrders);

router.post('/', verifyToken, requireRole('client'), createOrderValidator, orderController.createOrder);

router.patch(
  '/:id/status',
  verifyToken,
  requireRole('designer'),
  updateStatusValidator,
  orderController.updateOrderStatus
);

module.exports = router;
