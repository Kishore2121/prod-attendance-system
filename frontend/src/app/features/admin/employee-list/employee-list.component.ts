import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AdminService } from '../../../core/services/admin.service';
import { User } from '../../../core/models';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatTableModule, MatCardModule, MatFormFieldModule, MatInputModule,
    MatPaginatorModule, MatProgressSpinnerModule,
  ],
  template: `
    <div class="page-header">
      <h2>Employees</h2>
      <mat-form-field appearance="outline" style="width: 300px">
        <mat-label>Search employees</mat-label>
        <input matInput [(ngModel)]="search" (input)="onSearch()" placeholder="Name or email...">
      </mat-form-field>
    </div>

    @if (loading) {
      <div style="text-align: center; padding: 40px"><mat-spinner></mat-spinner></div>
    } @else {
      <mat-card>
        <table mat-table [dataSource]="employees" class="full-width">
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Name</th>
            <td mat-cell *matCellDef="let row">{{ row.name }}</td>
          </ng-container>
          <ng-container matColumnDef="email">
            <th mat-header-cell *matHeaderCellDef>Email</th>
            <td mat-cell *matCellDef="let row">{{ row.email }}</td>
          </ng-container>
          <ng-container matColumnDef="joined">
            <th mat-header-cell *matHeaderCellDef>Joined</th>
            <td mat-cell *matCellDef="let row">{{ row.createdAt | date:'mediumDate' }}</td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>

        @if (employees.length === 0) {
          <div style="text-align: center; padding: 40px; color: #999;">No employees found.</div>
        }

        <mat-paginator [length]="total" [pageSize]="20" (page)="onPage($event)"></mat-paginator>
      </mat-card>
    }
  `,
  styles: [`table { width: 100%; }`],
})
export class EmployeeListComponent implements OnInit {
  loading = true;
  employees: User[] = [];
  total = 0;
  search = '';
  displayedColumns = ['name', 'email', 'joined'];
  private page = 1;
  private searchTimeout: any;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.adminService.getEmployees({ page: this.page, search: this.search }).subscribe({
      next: (res) => {
        this.employees = res.employees;
        this.total = res.total;
        this.loading = false;
      },
      error: () => this.loading = false,
    });
  }

  onSearch(): void {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.page = 1;
      this.load();
    }, 400);
  }

  onPage(event: PageEvent): void {
    this.page = event.pageIndex + 1;
    this.load();
  }
}
