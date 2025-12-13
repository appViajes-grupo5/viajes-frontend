import { Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';
import { TripListComponent } from './pages/trip-list/trip-list';
import { TripDetailComponent } from './pages/trip-detail/trip-detail';
import { UserProfileComponent } from './pages/user-profile/user-profile';
import { authGuard } from './context-guards/auth.guard';
import { TripFormComponent } from './pages/trip-form/trip-form';
import { TripMyListComponent } from './pages/my-trip-list/trip-list';
import { HowItWorksComponent } from './pages/how-it-works/how-it-works';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password';
import { ResetPasswordComponent } from './pages/reset-password/reset-password';


export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'viajes',
    component: TripListComponent,
    canActivate: [authGuard],
  },
  {
    path: 'mis-viajes',
    component: TripMyListComponent,
    canActivate: [authGuard],
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
  },
  {
    path: 'viaje/:id',
    component: TripDetailComponent,
  },
  {
    path: 'mis-viajes/:id',
    component: TripDetailComponent,
  },
  {
    path: 'perfil',
    component: UserProfileComponent,
    canActivate: [authGuard],
  },

  {
    path: 'crear-viaje',
    component: TripFormComponent,
    canActivate: [authGuard],

  },
  {
    path: 'editar-viaje/:id',
    component: TripFormComponent,
    canActivate: [authGuard],
  },
  {
    path: 'como-funciona',
    component: HowItWorksComponent,
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
