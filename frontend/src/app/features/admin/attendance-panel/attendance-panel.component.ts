import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AdminService } from '../../../core/services/admin.service';
import { Attendance } from '../../../core/models';

@Component({
  selector: 'app-attendance-panel',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatTableModule, MatCardModule, MatButtonModule, MatIconModule,
    MatSelectModule, MatFormFieldModule, MatInputModule,
    MatPaginatorModule, MatProgressSpinnerModule, MatSnackBarModule,
  ],
  template: `
    <div class="page-header">
      <h2>Attendance Approval</h2>
      <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
        <mat-form-field appearance="outline" style="width: 150px">
          <mat-label>Status</mat-label>
          <mat-select [(value)]="filterStatus" (selectionChange)="load()">
            <mat-option value="">All</mat-option>
            <mat-option value="pending">Pending</mat-option>
            <mat-option value="approved">Approved</mat-option>
            <mat-option value="rejected">Rejected</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline" style="width: 160px">
          <mat-label>Date</mat-label>
          <input matInput type="date" [(ngModel)]="filterDate" (change)="load()">
        </mat-form-field>
        <button mat-raised-button color="accent" (click)="exportCSV()">
          <mat-icon>download</mat-icon> Export CSV
        </button>
      </div>
    </div>

    @if (loading) {
      <div style="text-align: center; padding: 40px"><mat-spinner></mat-spinner></div>
    } @else {
      <mat-card>
        <table mat-table [dataSource]="records" class="full-width">
          <ng-container matColumnDef="employee">
            <th mat-header-cell *matHeaderCellDef>Employee</th>
            <td mat-cell *matCellDef="let row">
              {{ getEmployeeName(row) }}
            </td>
          </ng-container>
          <ng-container matColumnDef="date">
            <th mat-header-cell *matHeaderCellDef>Date</th>
            <td mat-cell *matCellDef="let row">{{ row.date }}</td>
          </ng-container>
          <ng-container matColumnDef="checkIn">
            <th mat-header-cell *matHeaderCellDef>Check In</th>
            <td mat-cell *matCellDef="let row">{{ row.checkInTime | date:'shortTime' }}</td>
          </ng-container>
          <ng-container matColumnDef="checkOut">
            <th mat-header-cell *matHeaderCellDef>Check Out</th>
            <td mat-cell *matCellDef="let row">
              {{ row.checkOutTime ? (row.checkOutTime | date:'shortTime') : '—' }}
            </td>
          </ng-container>
          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let row">
              <span class="status-chip" [class]="'status-' + row.status">{{ row.status }}</span>
            </td>
          </ng-container>
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let row">
              @if (row.status === 'pending') {
                <button mat-icon-button color="primary" (click)="updateStatus(row._id, 'approved')" matTooltip="Approve">
                  <mat-icon>check_circle</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="updateStatus(row._id, 'rejected')" matTooltip="Reject">
                  <mat-icon>cancel</mat-icon>
                </button>
              } @else {
                <span style="color: #999; font-size: 12px">{{ row.status }}</span>
              }
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>

        @if (records.length === 0) {
          <div style="text-align: center; padding: 40px; color: #999;">No records found.</div>
        }

        <mat-paginator [length]="total" [pageSize]="20" (page)="onPage($event)"></mat-paginator>
      </mat-card>
    }
  `,
  styles: [`
    .status-chip {
      padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 500; text-transform: capitalize;
    }
    .status-pending { background: #fff3e0; color: #e65100; }
    .status-approved { background: #e8f5e9; color: #2e7d32; }
    .status-rejected { background: #ffebee; color: #c62828; }
    table { width: 100%; }
  `],
})
export class AttendancePanelComponent implements OnInit {
  loading = true;
  records: Attendance[] = [];
  total = 0;
  displayedColumns = ['employee', 'date', 'checkIn', 'checkOut', 'status', 'actions'];
  filterStatus = '';
  filterDate = '';
  private page = 1;

  constructor(private adminService: AdminService, private snackBar: MatSnackBar) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.adminService.getAllAttendance({
      page: this.page,
      status: this.filterStatus || undefined,
      date: this.filterDate || undefined,
    }).subscribe({
      next: (res) => {
        this.records = res.records;
        this.total = res.total;
        this.loading = false;
      },
      error: () => this.loading = false,
    });
  }

  getEmployeeName(row: Attendance): string {
    if (typeof row.userId === 'object' && row.userId !== null) {
      return row.userId.name;
    }
    return 'N/A';
  }

  updateStatus(id: string, status: 'approved' | 'rejected'): void {
    this.adminService.updateAttendanceStatus(id, status).subscribe({
      next: () => {
        this.snackBar.open(`Attendance ${status}`, 'Close', { duration: 3000, panelClass: 'success-snackbar' });
        this.load();
      },
      error: (err) => {
        this.snackBar.open(err.error?.error || 'Update failed', 'Close', { duration: 5000, panelClass: 'error-snackbar' });
      },
    });
  }

  exportCSV(): void {
    this.adminService.exportAttendance().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'attendance-report.csv';
        a.click();
        window.URL.revokeObjectURL(url);
      },
    });
  }

  onPage(event: PageEvent): void {
    this.page = event.pageIndex + 1;
    this.load();
  }
}
