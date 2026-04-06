const router = require('express').Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');
const { registerValidator, loginValidator } = require('../validators/authValidators');

router.post('/register', registerValidator, authController.register);
router.post('/login', loginValidator, authController.login);
router.get('/me', verifyToken, authController.getMe);

module.exports = router;
