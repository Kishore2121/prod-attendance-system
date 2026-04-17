const router = require('express').Router();
const { register, login, getMe } = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth');
const { registerValidation, loginValidation } = require('../middleware/validators');

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/me', authenticate, getMe);

module.exports = router;
