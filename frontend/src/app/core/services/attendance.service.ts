import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { Attendance, AttendancePercentage, PaginatedResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class AttendanceService {
  private readonly apiUrl = `${environment.apiUrl}/attendance`;

  constructor(private http: HttpClient) {}

  checkIn(): Observable<{ message: string; attendance: Attendance }> {
    return this.http.post<{ message: string; attendance: Attendance }>(`${this.apiUrl}/check-in`, {});
  }

  checkOut(): Observable<{ message: string; attendance: Attendance }> {
    return this.http.put<{ message: string; attendance: Attendance }>(`${this.apiUrl}/check-out`, {});
  }

  getTodayAttendance(): Observable<{ attendance: Attendance | null }> {
    return this.http.get<{ attendance: Attendance | null }>(`${this.apiUrl}/today`);
  }

  getMyAttendance(params?: { month?: number; year?: number; page?: number }): Observable<PaginatedResponse<Attendance>> {
    let httpParams = new HttpParams();
    if (params?.month) httpParams = httpParams.set('month', params.month);
    if (params?.year) httpParams = httpParams.set('year', params.year);
    if (params?.page) httpParams = httpParams.set('page', params.page);
    return this.http.get<PaginatedResponse<Attendance>>(`${this.apiUrl}/my`, { params: httpParams });
  }

  getPercentage(month?: number, year?: number): Observable<AttendancePercentage> {
    let httpParams = new HttpParams();
    if (month) httpParams = httpParams.set('month', month);
    if (year) httpParams = httpParams.set('year', year);
    return this.http.get<AttendancePercentage>(`${this.apiUrl}/percentage`, { params: httpParams });
  }
}
