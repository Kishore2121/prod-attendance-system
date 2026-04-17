import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AdminService } from '../../../core/services/admin.service';
import { DashboardStats } from '../../../core/models';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatTableModule, MatProgressSpinnerModule],
  template: `
    <h2>Admin Dashboard</h2>

    @if (loading) {
      <div style="text-align: center; padding: 40px"><mat-spinner></mat-spinner></div>
    } @else if (stats) {
      <!-- Stat cards -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px;">
        <mat-card class="stat-card">
          <mat-icon style="font-size: 40px; height: 40px; width: 40px; color: #3f51b5">people</mat-icon>
          <div class="stat-value">{{ stats.totalEmployees }}</div>
          <div class="stat-label">Total Employees</div>
        </mat-card>
        <mat-card class="stat-card">
          <mat-icon style="font-size: 40px; height: 40px; width: 40px; color: #4caf50">event_available</mat-icon>
          <div class="stat-value">{{ stats.totalAttendance }}</div>
          <div class="stat-label">Total Attendance Records</div>
        </mat-card>
        <mat-card class="stat-card">
          <mat-icon style="font-size: 40px; height: 40px; width: 40px; color: #ff9800">pending_actions</mat-icon>
          <div class="stat-value">{{ stats.pendingApprovals }}</div>
          <div class="stat-label">Pending Approvals</div>
        </mat-card>
        <mat-card class="stat-card">
          <mat-icon style="font-size: 40px; height: 40px; width: 40px; color: #f44336">warning</mat-icon>
          <div class="stat-value low-attendance">{{ stats.lowAttendance.length }}</div>
          <div class="stat-label">Below 60% Attendance</div>
        </mat-card>
      </div>

      <!-- Low attendance table -->
      @if (stats.lowAttendance.length > 0) {
        <mat-card>
          <mat-card-header>
            <mat-card-title>⚠ Employees with Low Attendance (< 60%)</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <table mat-table [dataSource]="stats.lowAttendance" class="full-width">
              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef>Name</th>
                <td mat-cell *matCellDef="let row">{{ row.employee.name }}</td>
              </ng-container>
              <ng-container matColumnDef="email">
                <th mat-header-cell *matHeaderCellDef>Email</th>
                <td mat-cell *matCellDef="let row">{{ row.employee.email }}</td>
              </ng-container>
              <ng-container matColumnDef="approved">
                <th mat-header-cell *matHeaderCellDef>Approved Days</th>
                <td mat-cell *matCellDef="let row">{{ row.approvedDays }} / {{ row.workingDays }}</td>
              </ng-container>
              <ng-container matColumnDef="percentage">
                <th mat-header-cell *matHeaderCellDef>Percentage</th>
                <td mat-cell *matCellDef="let row" class="low-attendance">{{ row.percentage }}%</td>
              </ng-container>
              <tr mat-header-row *matHeaderRowDef="lowColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: lowColumns;"></tr>
            </table>
          </mat-card-content>
        </mat-card>
      }
    }
  `,
  styles: [`table { width: 100%; }`],
})
export class AdminDashboardComponent implements OnInit {
  loading = true;
  stats: DashboardStats | null = null;
  lowColumns = ['name', 'email', 'approved', 'percentage'];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.adminService.getDashboard().subscribe({
      next: (res) => {
        this.stats = res;
        this.loading = false;
      },
      error: () => this.loading = false,
    });
  }
}
