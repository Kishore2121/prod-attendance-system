import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AttendanceService } from '../../../core/services/attendance.service';
import { Attendance } from '../../../core/models';

@Component({
  selector: 'app-attendance-history',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatTableModule, MatCardModule, MatSelectModule, MatFormFieldModule,
    MatChipsModule, MatPaginatorModule, MatProgressSpinnerModule,
  ],
  template: `
    <div class="page-header">
      <h2>Attendance History</h2>
      <div style="display: flex; gap: 12px; align-items: center;">
        <mat-form-field appearance="outline" style="width: 120px">
          <mat-label>Month</mat-label>
          <mat-select [(value)]="selectedMonth" (selectionChange)="loadHistory()">
            @for (m of months; track m.value) {
              <mat-option [value]="m.value">{{ m.label }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline" style="width: 100px">
          <mat-label>Year</mat-label>
          <mat-select [(value)]="selectedYear" (selectionChange)="loadHistory()">
            @for (y of years; track y) {
              <mat-option [value]="y">{{ y }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
      </div>
    </div>

    @if (loading) {
      <div style="text-align: center; padding: 40px"><mat-spinner></mat-spinner></div>
    } @else {
      <mat-card>
        <table mat-table [dataSource]="records" class="full-width">
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

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>

        @if (records.length === 0) {
          <div style="text-align: center; padding: 40px; color: #999;">
            No attendance records found for this period.
          </div>
        }

        <mat-paginator
          [length]="total"
          [pageSize]="31"
          [pageSizeOptions]="[10, 20, 31]"
          (page)="onPage($event)">
        </mat-paginator>
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
export class AttendanceHistoryComponent implements OnInit {
  loading = true;
  records: Attendance[] = [];
  total = 0;
  displayedColumns = ['date', 'checkIn', 'checkOut', 'status'];

  selectedMonth = new Date().getMonth() + 1;
  selectedYear = new Date().getFullYear();

  months = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: new Date(2000, i).toLocaleString('en', { month: 'long' }),
  }));
  years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  private page = 1;

  constructor(private attendanceService: AttendanceService) {}

  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory(): void {
    this.loading = true;
    this.attendanceService.getMyAttendance({
      month: this.selectedMonth,
      year: this.selectedYear,
      page: this.page,
    }).subscribe({
      next: (res) => {
        this.records = res.records;
        this.total = res.total;
        this.loading = false;
      },
      error: () => this.loading = false,
    });
  }

  onPage(event: PageEvent): void {
    this.page = event.pageIndex + 1;
    this.loadHistory();
  }
}
