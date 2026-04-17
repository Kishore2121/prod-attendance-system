import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const requiredRole = route.data?.['role'];

  const user = authService.user();
  if (user && user.role === requiredRole) {
    return true;
  }

  // Redirect to appropriate dashboard or login
  if (user) {
    router.navigate([`/${user.role}/dashboard`]);
  } else {
    router.navigate(['/login']);
  }
  return false;
};
