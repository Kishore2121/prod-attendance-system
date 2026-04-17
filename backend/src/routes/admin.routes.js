const router = require('express').Router();
const { authenticate, authorize } = require('../middleware/auth');
const { statusValidation } = require('../middleware/validators');
const {
  getAllEmployees, getAllAttendance, updateAttendanceStatus, getDashboard, exportAttendance,
} = require('../controllers/admin.controller');

// All routes require admin authentication
router.use(authenticate, authorize('admin'));

router.get('/employees', getAllEmployees);
router.get('/attendance', getAllAttendance);
router.put('/attendance/:id/status', statusValidation, updateAttendanceStatus);
router.get('/dashboard', getDashboard);
router.get('/export/attendance', exportAttendance);

module.exports = router;
