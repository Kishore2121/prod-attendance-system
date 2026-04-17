import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    RouterOutlet, RouterLink, RouterLinkActive,
    MatToolbarModule, MatButtonModule, MatIconModule, MatSidenavModule, MatListModule,
  ],
  template: `
    <mat-toolbar color="primary">
      <mat-icon>admin_panel_settings</mat-icon>
      <span style="margin-left: 8px">Admin Panel</span>
      <span class="spacer"></span>
      <span style="margin-right: 16px; font-size: 14px">{{ authService.user()?.name }}</span>
      <button mat-icon-button (click)="authService.logout()">
        <mat-icon>logout</mat-icon>
      </button>
    </mat-toolbar>

    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav mode="side" opened class="sidenav">
        <mat-nav-list>
          <a mat-list-item routerLink="dashboard" routerLinkActive="active-link">
            <mat-icon matListItemIcon>dashboard</mat-icon>
            <span>Dashboard</span>
          </a>
          <a mat-list-item routerLink="employees" routerLinkActive="active-link">
            <mat-icon matListItemIcon>people</mat-icon>
            <span>Employees</span>
          </a>
          <a mat-list-item routerLink="attendance" routerLinkActive="active-link">
            <mat-icon matListItemIcon>fact_check</mat-icon>
            <span>Attendance</span>
          </a>
        </mat-nav-list>
      </mat-sidenav>

      <mat-sidenav-content class="content">
        <div class="container">
          <router-outlet />
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .sidenav-container { height: calc(100vh - 64px); }
    .sidenav { width: 220px; }
    .content { padding: 0; }
    .active-link { background: rgba(63, 81, 181, 0.1) !important; }
    @media (max-width: 600px) {
      .sidenav { width: 60px; }
      .sidenav span { display: none; }
    }
  `],
})
export class AdminLayoutComponent {
  constructor(public authService: AuthService) {}
}
