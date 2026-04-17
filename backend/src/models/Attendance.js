const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
  },
  date: {
    type: String, // ISO date string YYYY-MM-DD
    required: [true, 'Date is required'],
  },
  checkInTime: {
    type: Date,
    required: [true, 'Check-in time is required'],
  },
  checkOutTime: {
    type: Date,
    default: null,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
}, {
  timestamps: true,
});

// Compound index: one attendance per user per day
attendanceSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
