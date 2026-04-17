import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { Attendance, DashboardStats, PaginatedResponse, User } from '../models';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly apiUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  getEmployees(params?: { page?: number; search?: string }): Observable<{ employees: User[]; total: number }> {
    let httpParams = new HttpParams();
    if (params?.page) httpParams = httpParams.set('page', params.page);
    if (params?.search) httpParams = httpParams.set('search', params.search);
    return this.http.get<{ employees: User[]; total: number }>(`${this.apiUrl}/employees`, { params: httpParams });
  }

  getAllAttendance(params?: {
    page?: number; status?: string; date?: string; employeeId?: string; startDate?: string; endDate?: string;
  }): Observable<PaginatedResponse<Attendance>> {
    let httpParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val) httpParams = httpParams.set(key, val);
      });
    }
    return this.http.get<PaginatedResponse<Attendance>>(`${this.apiUrl}/attendance`, { params: httpParams });
  }

  updateAttendanceStatus(id: string, status: 'approved' | 'rejected'): Observable<{ message: string; attendance: Attendance }> {
    return this.http.put<{ message: string; attendance: Attendance }>(`${this.apiUrl}/attendance/${id}/status`, { status });
  }

  getDashboard(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/dashboard`);
  }

  exportAttendance(startDate?: string, endDate?: string): Observable<Blob> {
    let httpParams = new HttpParams();
    if (startDate) httpParams = httpParams.set('startDate', startDate);
    if (endDate) httpParams = httpParams.set('endDate', endDate);
    return this.http.get(`${this.apiUrl}/export/attendance`, { params: httpParams, responseType: 'blob' });
  }
}
