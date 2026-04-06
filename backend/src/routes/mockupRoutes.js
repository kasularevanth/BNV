const router = require('express').Router();
const mockupController = require('../controllers/mockupController');
const { verifyToken } = require('../middleware/auth');
const { requireRole } = require('../middleware/roleCheck');
const upload = require('../middleware/upload');
const { createMockupValidator, updateMockupValidator } = require('../validators/mockupValidators');

// Public — browse all mockups
router.get('/', verifyToken, mockupController.getMockups);

// Designer — own mockups list
router.get('/my', verifyToken, requireRole('designer'), mockupController.getMyMockups);

// Get single mockup
router.get('/:id', verifyToken, mockupController.getMockupById);

// Designer — upload new mockup
router.post(
  '/',
  verifyToken,
  requireRole('designer'),
  upload.single('image'),
  createMockupValidator,
  mockupController.createMockup
);

// Designer — update mockup
router.put(
  '/:id',
  verifyToken,
  requireRole('designer'),
  upload.single('image'),
  updateMockupValidator,
  mockupController.updateMockup
);

// Designer — delete mockup
router.delete('/:id', verifyToken, requireRole('designer'), mockupController.deleteMockup);

module.exports = router;
