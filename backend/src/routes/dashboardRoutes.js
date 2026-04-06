const router = require('express').Router();
const { verifyToken } = require('../middleware/auth');
const orderService = require('../services/orderService');

router.get('/stats', verifyToken, async (req, res, next) => {
  try {
    const stats = await orderService.getDashboardStats(req.user._id, req.user.role);
    res.json({ success: true, stats });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
