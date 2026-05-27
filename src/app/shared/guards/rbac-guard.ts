import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from 'src/app/pages/auth/services/auth';

export const rbacGuard: CanActivateFn = (route, state) => {
  const authService = inject(Auth);
  const router = inject(Router);

  const allowedRoles = route.data?.['roles'] as string[];

  const role = authService.role();

  if (!role) return router.createUrlTree(['/auth']);

  if (!allowedRoles.includes(role || '')) return router.createUrlTree(['/unauthorized']);

  return true;
};
