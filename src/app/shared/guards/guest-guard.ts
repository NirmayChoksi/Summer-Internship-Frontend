import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserRole } from 'src/app/pages/auth/models/enums';
import { Auth } from 'src/app/pages/auth/services/auth';

export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(Auth);
  const router = inject(Router);

  const user = authService.user();

  if (!user) return true;

  switch (user.role) {
    case UserRole.Brand:
      return router.createUrlTree(['/brand']);
    case UserRole.Influencer:
      return router.createUrlTree(['/influencer']);
    default:
      return router.createUrlTree(['/']);
  }
};
