const router = require('express').Router();
const { authenticate, authorize } = require('../middleware/auth');
const {
  checkIn, checkOut, getMyAttendance, getTodayAttendance, getAttendancePercentage,
} = require('../controllers/attendance.controller');

// All routes require authentication and employee role
router.use(authenticate);

router.post('/check-in', authorize('employee'), checkIn);
router.put('/check-out', authorize('employee'), checkOut);
router.get('/my', authorize('employee'), getMyAttendance);
router.get('/today', authorize('employee'), getTodayAttendance);
router.get('/percentage', authorize('employee'), getAttendancePercentage);

module.exports = router;
