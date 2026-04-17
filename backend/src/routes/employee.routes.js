const router = require('express').Router();
const { authenticate, authorize } = require('../middleware/auth');
const User = require('../models/User');

// GET /api/employees - get current employee profile
router.get('/profile', authenticate, authorize('employee'), async (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
