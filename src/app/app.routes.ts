import { Routes } from '@angular/router';
import { UserRole } from './pages/auth/models/enums';
import { authGuard } from './shared/guards/auth-guard';
import { guestGuard } from './shared/guards/guest-guard';
import { profileCompletionGuard } from './shared/guards/profile-completion-guard';
import { rbacGuard } from './shared/guards/rbac-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  {
    path: 'auth',
    canActivate: [guestGuard],
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      {
        path: 'register',
        loadComponent: () =>
          import('./pages/auth/register/register.page').then((m) => m.RegisterPage),
      },
      {
        path: 'verify-otp',
        loadComponent: () =>
          import('./pages/auth/verify-otp/verify-otp.page').then((m) => m.VerifyOtpPage),
      },
      {
        path: 'create-password',
        loadComponent: () =>
          import('./pages/auth/create-password/create-password.page').then(
            (m) => m.CreatePasswordPage,
          ),
      },
      {
        path: 'login',
        loadComponent: () => import('./pages/auth/login/login.page').then((m) => m.LoginPage),
      },
    ],
  },
  {
    path: 'brand',
    loadComponent: () => import('./pages/brand/brand.page').then((m) => m.BrandPage),
    canActivate: [authGuard, rbacGuard],
    canActivateChild: [profileCompletionGuard],
    data: {
      roles: [UserRole.Brand],
    },
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {
        path: 'home',
        loadComponent: () => import('./pages/brand/home/home.page').then((m) => m.HomePage),
      },
      {
        path: 'campaigns',
        loadComponent: () =>
          import('./pages/brand/campaigns/campaigns.page').then((m) => m.CampaignsPage),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./pages/brand/profile/profile.page').then((m) => m.ProfilePage),
      },
    ],
  },
  {
    path: 'influencer',
    loadComponent: () => import('./pages/influencer/influencer.page').then((m) => m.InfluencerPage),
    canActivate: [authGuard, rbacGuard],
    canActivateChild: [profileCompletionGuard],
    data: {
      roles: [UserRole.Influencer],
    },
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {
        path: 'home',
        loadComponent: () => import('./pages/influencer/home/home.page').then((m) => m.HomePage),
      },
      {
        path: 'campaigns',
        loadComponent: () =>
          import('./pages/influencer/campaigns/campaigns.page').then((m) => m.CampaignsPage),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./pages/influencer/profile/profile.page').then((m) => m.ProfilePage),
      },
    ],
  },
  {
    path: 'kitchen-sink',
    loadComponent: () =>
      import('./pages/kitchen-sink/kitchen-sink.page').then((m) => m.KitchenSinkPage),
  },
  {
    path: 'unauthorized',
    loadComponent: () =>
      import('./pages/unauthorized/unauthorized.page').then((m) => m.UnauthorizedPage),
  },
  { path: '**', redirectTo: 'auth', pathMatch: 'full' },
];
