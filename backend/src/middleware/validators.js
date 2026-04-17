const { body } = require('express-validator');

exports.registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['admin', 'employee']).withMessage('Role must be admin or employee'),
];

exports.loginValidation = [
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

exports.attendanceValidation = [
  body('date').optional().isISO8601().withMessage('Date must be valid ISO format'),
  body('checkOutTime').optional().isISO8601().withMessage('Check-out time must be valid'),
];

exports.statusValidation = [
  body('status').isIn(['approved', 'rejected']).withMessage('Status must be approved or rejected'),
];
