import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent),
  },
  {
    path: 'employee',
    canActivate: [authGuard, roleGuard],
    data: { role: 'employee' },
    loadComponent: () => import('./features/employee/employee-layout/employee-layout.component').then(m => m.EmployeeLayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/employee/dashboard/employee-dashboard.component').then(m => m.EmployeeDashboardComponent),
      },
      {
        path: 'history',
        loadComponent: () => import('./features/employee/attendance-history/attendance-history.component').then(m => m.AttendanceHistoryComponent),
      },
    ],
  },
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard],
    data: { role: 'admin' },
    loadComponent: () => import('./features/admin/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/admin/dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
      },
      {
        path: 'employees',
        loadComponent: () => import('./features/admin/employee-list/employee-list.component').then(m => m.EmployeeListComponent),
      },
      {
        path: 'attendance',
        loadComponent: () => import('./features/admin/attendance-panel/attendance-panel.component').then(m => m.AttendancePanelComponent),
      },
    ],
  },
  { path: '**', redirectTo: '/login' },
];
