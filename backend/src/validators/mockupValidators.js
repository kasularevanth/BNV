const { body, validationResult } = require('express-validator');

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

const CATEGORIES = ['Packaging', 'Bottles', 'Apparel', 'Beverage', 'Electronics', 'Other'];

const createMockupValidator = [
  body('name').trim().notEmpty().withMessage('Mockup name is required').isLength({ max: 150 }),
  body('description').optional().isLength({ max: 1000 }),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a non-negative number'),
  body('category').isIn(CATEGORIES).withMessage(`Category must be one of: ${CATEGORIES.join(', ')}`),
  handleValidation,
];

const updateMockupValidator = [
  body('name').optional().trim().notEmpty().isLength({ max: 150 }),
  body('description').optional().isLength({ max: 1000 }),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a non-negative number'),
  body('category').optional().isIn(CATEGORIES),
  handleValidation,
];

module.exports = { createMockupValidator, updateMockupValidator };
