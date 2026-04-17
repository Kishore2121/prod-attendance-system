import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AttendanceService } from '../../../core/services/attendance.service';
import { Attendance, AttendancePercentage } from '../../../core/models';

@Component({
  selector: 'app-employee-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule, MatButtonModule, MatIconModule,
    MatProgressSpinnerModule, MatSnackBarModule, MatProgressBarModule,
  ],
  template: `
    <h2>Employee Dashboard</h2>

    @if (loading) {
      <div style="text-align:center; padding: 40px"><mat-spinner></mat-spinner></div>
    } @else {
      <!-- Attendance Action Card -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px;">
        <mat-card>
          <mat-card-header>
            <mat-card-title>Today's Attendance</mat-card-title>
            <mat-card-subtitle>{{ today }}</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content style="padding: 24px 0; text-align: center;">
            @if (!todayAttendance) {
              <p style="color: #999; margin-bottom: 16px">You haven't checked in today</p>
              <button mat-raised-button color="primary" (click)="checkIn()" [disabled]="actionLoading">
                <mat-icon>login</mat-icon> Check In
              </button>
            } @else if (!todayAttendance.checkOutTime) {
              <p style="color: #4caf50; margin-bottom: 8px">
                <mat-icon style="vertical-align: middle">check_circle</mat-icon>
                Checked in at {{ todayAttendance.checkInTime | date:'shortTime' }}
              </p>
              <p style="font-size: 12px; color: #999; margin-bottom: 16px">Status: {{ todayAttendance.status }}</p>
              <button mat-raised-button color="accent" (click)="checkOut()" [disabled]="actionLoading">
                <mat-icon>logout</mat-icon> Check Out
              </button>
            } @else {
              <p style="color: #4caf50; margin-bottom: 8px">
                <mat-icon style="vertical-align: middle">check_circle</mat-icon>
                Checked in: {{ todayAttendance.checkInTime | date:'shortTime' }}
              </p>
              <p style="color: #2196f3">
                <mat-icon style="vertical-align: middle">check_circle</mat-icon>
                Checked out: {{ todayAttendance.checkOutTime | date:'shortTime' }}
              </p>
              <p style="font-size: 12px; color: #999; margin-top: 8px">Status: {{ todayAttendance.status }}</p>
            }
          </mat-card-content>
        </mat-card>

        <!-- Attendance Percentage Card -->
        <mat-card class="stat-card">
          <mat-card-header>
            <mat-card-title>Attendance Percentage</mat-card-title>
            <mat-card-subtitle>Current Month (Approved only)</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content style="padding: 24px 0; text-align: center;">
            @if (percentage) {
              <div class="stat-value" [class.low-attendance]="percentage.percentage < 60">
                {{ percentage.percentage }}%
              </div>
              <mat-progress-bar
                mode="determinate"
                [value]="percentage.percentage"
                [color]="percentage.percentage < 60 ? 'warn' : 'primary'"
                style="margin: 16px 0;">
              </mat-progress-bar>
              <p class="stat-label">
                {{ percentage.approvedRecords }} approved / {{ percentage.workingDays }} working days
              </p>
              @if (percentage.percentage < 60) {
                <p style="color: #f44336; font-weight: 500; margin-top: 8px">
                  ⚠ Your attendance is below 60%
                </p>
              }
            }
          </mat-card-content>
        </mat-card>
      </div>
    }
  `,
})
export class EmployeeDashboardComponent implements OnInit {
  loading = true;
  actionLoading = false;
  todayAttendance: Attendance | null = null;
  percentage: AttendancePercentage | null = null;
  today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  constructor(
    private attendanceService: AttendanceService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    const now = new Date();

    this.attendanceService.getTodayAttendance().subscribe({
      next: (res) => {
        this.todayAttendance = res.attendance;
        this.loading = false;
      },
      error: () => this.loading = false,
    });

    this.attendanceService.getPercentage(now.getMonth() + 1, now.getFullYear()).subscribe({
      next: (res) => this.percentage = res,
    });
  }

  checkIn(): void {
    this.actionLoading = true;
    this.attendanceService.checkIn().subscribe({
      next: (res) => {
        this.todayAttendance = res.attendance;
        this.actionLoading = false;
        this.snackBar.open('Checked in successfully!', 'Close', { duration: 3000, panelClass: 'success-snackbar' });
      },
      error: (err) => {
        this.actionLoading = false;
        this.snackBar.open(err.error?.error || 'Check-in failed', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
      },
    });
  }

  checkOut(): void {
    this.actionLoading = true;
    this.attendanceService.checkOut().subscribe({
      next: (res) => {
        this.todayAttendance = res.attendance;
        this.actionLoading = false;
        this.snackBar.open('Checked out successfully!', 'Close', { duration: 3000, panelClass: 'success-snackbar' });
      },
      error: (err) => {
        this.actionLoading = false;
        this.snackBar.open(err.error?.error || 'Check-out failed', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
      },
    });
  }
}
