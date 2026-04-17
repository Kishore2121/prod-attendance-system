export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'employee';
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface Attendance {
  _id: string;
  userId: string | { _id: string; name: string; email: string };
  date: string;
  checkInTime: string;
  checkOutTime: string | null;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface PaginatedResponse<T> {
  records: T[];
  total: number;
  page: number;
  limit: number;
}

export interface DashboardStats {
  totalEmployees: number;
  totalAttendance: number;
  pendingApprovals: number;
  workingDays: number;
  lowAttendance: {
    employee: { id: string; name: string; email: string };
    approvedDays: number;
    workingDays: number;
    percentage: number;
  }[];
}

export interface AttendancePercentage {
  totalRecords: number;
  approvedRecords: number;
  workingDays: number;
  percentage: number;
}
