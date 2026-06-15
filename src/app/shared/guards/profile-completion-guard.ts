import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserRole } from 'src/app/pages/auth/models/enums';
import { Auth } from 'src/app/pages/auth/services/auth';

export const profileCompletionGuard: CanActivateFn = (route, state) => {
  const authService = inject(Auth);
  const router = inject(Router);

  const user = authService.user();

  if (!user) return router.createUrlTree(['/auth/login']);

  if (user.isProfileComplete) return true;

  const urlPath = state.url.split('?')[0];

  const allowedRoutes = ['/brand/profile', '/influencer/profile'];

  if (allowedRoutes.includes(urlPath)) return true;

  switch (user.role) {
    case UserRole.Brand:
      return router.createUrlTree(['/brand/profile']);
    case UserRole.Influencer:
      return router.createUrlTree(['/influencer/profile']);
    default:
      return router.createUrlTree(['/auth/login']);
  }
};
