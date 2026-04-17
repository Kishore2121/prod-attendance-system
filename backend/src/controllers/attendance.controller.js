const { validationResult } = require('express-validator');
const Attendance = require('../models/Attendance');

/**
 * POST /api/attendance/check-in
 * Mark attendance (check-in) for the current day
 */
exports.checkIn = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const now = new Date();
    const todayDate = now.toISOString().split('T')[0]; // YYYY-MM-DD

    // Check if already checked in today
    const existing = await Attendance.findOne({ userId, date: todayDate });
    if (existing) {
      return res.status(409).json({ error: 'Attendance already marked for today' });
    }

    const attendance = await Attendance.create({
      userId,
      date: todayDate,
      checkInTime: now,
    });

    res.status(201).json({ message: 'Check-in successful', attendance });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/attendance/check-out
 * Mark check-out for today's attendance
 */
exports.checkOut = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const todayDate = new Date().toISOString().split('T')[0];

    const attendance = await Attendance.findOne({ userId, date: todayDate });
    if (!attendance) {
      return res.status(404).json({ error: 'No check-in found for today. Please check in first.' });
    }

    if (attendance.checkOutTime) {
      return res.status(409).json({ error: 'Already checked out for today' });
    }

    attendance.checkOutTime = new Date();
    await attendance.save();

    res.json({ message: 'Check-out successful', attendance });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/attendance/my
 * Get current user's attendance history
 */
exports.getMyAttendance = async (req, res, next) => {
  try {
    const { month, year, page = 1, limit = 31 } = req.query;
    const filter = { userId: req.user._id };

    // Optional month/year filter
    if (month && year) {
      const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
      const endMonth = parseInt(month) === 12 ? 1 : parseInt(month) + 1;
      const endYear = parseInt(month) === 12 ? parseInt(year) + 1 : parseInt(year);
      const endDate = `${endYear}-${String(endMonth).padStart(2, '0')}-01`;
      filter.date = { $gte: startDate, $lt: endDate };
    }

    const total = await Attendance.countDocuments(filter);
    const records = await Attendance.find(filter)
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({ records, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/attendance/today
 * Get today's attendance for current user
 */
exports.getTodayAttendance = async (req, res, next) => {
  try {
    const todayDate = new Date().toISOString().split('T')[0];
    const attendance = await Attendance.findOne({ userId: req.user._id, date: todayDate });
    res.json({ attendance });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/attendance/percentage
 * Get attendance percentage for current user (approved days / working days)
 */
exports.getAttendancePercentage = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { month, year } = req.query;

    const filter = { userId };
    if (month && year) {
      const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
      const endMonth = parseInt(month) === 12 ? 1 : parseInt(month) + 1;
      const endYear = parseInt(month) === 12 ? parseInt(year) + 1 : parseInt(year);
      const endDate = `${endYear}-${String(endMonth).padStart(2, '0')}-01`;
      filter.date = { $gte: startDate, $lt: endDate };
    }

    const totalRecords = await Attendance.countDocuments(filter);
    const approvedRecords = await Attendance.countDocuments({ ...filter, status: 'approved' });

    // Calculate working days (weekdays) in the month
    let workingDays = totalRecords; // fallback
    if (month && year) {
      workingDays = getWorkingDaysInMonth(parseInt(year), parseInt(month));
    } else {
      // Current month working days
      const now = new Date();
      workingDays = getWorkingDaysInMonth(now.getFullYear(), now.getMonth() + 1);
    }

    const percentage = workingDays > 0 ? Math.round((approvedRecords / workingDays) * 100) : 0;

    res.json({
      totalRecords,
      approvedRecords,
      workingDays,
      percentage,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Calculate number of weekdays (Mon-Fri) in a given month up to today
 */
function getWorkingDaysInMonth(year, month) {
  const now = new Date();
  const lastDay = new Date(year, month, 0).getDate();
  const today = now.getFullYear() === year && now.getMonth() + 1 === month
    ? now.getDate() : lastDay;

  let count = 0;
  for (let day = 1; day <= today; day++) {
    const d = new Date(year, month - 1, day);
    const dow = d.getDay();
    if (dow !== 0 && dow !== 6) count++;
  }
  return count;
}
