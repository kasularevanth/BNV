const { body, param, validationResult } = require('express-validator');

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

const ORDER_STATUSES = ['pending', 'active', 'completed', 'cancelled'];

const createOrderValidator = [
  body('mockupId').isMongoId().withMessage('Valid mockup ID is required'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('notes').optional().isLength({ max: 500 }),
  handleValidation,
];

const updateStatusValidator = [
  param('id').isMongoId().withMessage('Valid order ID is required'),
  body('status').isIn(ORDER_STATUSES).withMessage(`Status must be one of: ${ORDER_STATUSES.join(', ')}`),
  handleValidation,
];

module.exports = { createOrderValidator, updateStatusValidator };
