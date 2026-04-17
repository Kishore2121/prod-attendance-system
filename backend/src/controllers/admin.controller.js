const User = require('../models/User');
const Attendance = require('../models/Attendance');
const { validationResult } = require('express-validator');

/**
 * GET /api/admin/employees
 * Get all employees (admin only)
 */
exports.getAllEmployees = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const filter = { role: 'employee' };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await User.countDocuments(filter);
    const employees = await User.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({ employees, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/attendance
 * Get all attendance records with filters (admin only)
 */
exports.getAllAttendance = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, date, employeeId, startDate, endDate } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (date) filter.date = date;
    if (employeeId) filter.userId = employeeId;
    if (startDate && endDate) {
      filter.date = { $gte: startDate, $lte: endDate };
    }

    const total = await Attendance.countDocuments(filter);
    const records = await Attendance.find(filter)
      .populate('userId', 'name email')
      .sort({ date: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({ records, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/admin/attendance/:id/status
 * Approve or reject an attendance record
 */
exports.updateAttendanceStatus = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    }

    const { id } = req.params;
    const { status } = req.body;

    const attendance = await Attendance.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    ).populate('userId', 'name email');

    if (!attendance) {
      return res.status(404).json({ error: 'Attendance record not found' });
    }

    res.json({ message: `Attendance ${status}`, attendance });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/dashboard
 * Dashboard analytics
 */
exports.getDashboard = async (req, res, next) => {
  try {
    const totalEmployees = await User.countDocuments({ role: 'employee' });
    const totalAttendance = await Attendance.countDocuments();
    const pendingApprovals = await Attendance.countDocuments({ status: 'pending' });

    // Get current month working days
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const workingDays = getWorkingDaysInMonth(year, month);

    // Find employees with < 60% attendance
    const employees = await User.find({ role: 'employee' });
    const lowAttendance = [];

    for (const emp of employees) {
      const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
      const endMonth = month === 12 ? 1 : month + 1;
      const endYear = month === 12 ? year + 1 : year;
      const endDate = `${endYear}-${String(endMonth).padStart(2, '0')}-01`;

      const approvedDays = await Attendance.countDocuments({
        userId: emp._id,
        date: { $gte: startDate, $lt: endDate },
        status: 'approved',
      });

      const percentage = workingDays > 0 ? Math.round((approvedDays / workingDays) * 100) : 0;

      if (percentage < 60) {
        lowAttendance.push({
          employee: { id: emp._id, name: emp.name, email: emp.email },
          approvedDays,
          workingDays,
          percentage,
        });
      }
    }

    res.json({
      totalEmployees,
      totalAttendance,
      pendingApprovals,
      workingDays,
      lowAttendance,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/export/attendance
 * Export attendance records as CSV
 */
exports.exportAttendance = async (req, res, next) => {
  try {
    const { startDate, endDate, employeeId } = req.query;
    const filter = {};
    if (startDate && endDate) filter.date = { $gte: startDate, $lte: endDate };
    if (employeeId) filter.userId = employeeId;

    const records = await Attendance.find(filter)
      .populate('userId', 'name email')
      .sort({ date: -1 });

    // Build CSV
    let csv = 'Employee Name,Email,Date,Check-In,Check-Out,Status\n';
    for (const r of records) {
      const name = r.userId?.name || 'N/A';
      const email = r.userId?.email || 'N/A';
      const checkIn = r.checkInTime ? new Date(r.checkInTime).toLocaleTimeString() : '';
      const checkOut = r.checkOutTime ? new Date(r.checkOutTime).toLocaleTimeString() : '';
      csv += `"${name}","${email}","${r.date}","${checkIn}","${checkOut}","${r.status}"\n`;
    }

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=attendance-report.csv');
    res.send(csv);
  } catch (error) {
    next(error);
  }
};

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
