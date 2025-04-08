import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { JwtService } from '../../../shared/service/jwt.service';

export const authGuard: CanActivateFn = (route, state) => {
  const jwtService = inject(JwtService);
  const router = inject(Router);

  if (jwtService.isTokenExpired()) {
    alert('Your session has expired. Please log in again.');
    router.navigate(['/login']);
    return false;
  }

  return true;
};
