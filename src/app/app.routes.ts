import { Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';
import { TripListComponent } from './pages/trip-list/trip-list';
import { TripDetailComponent } from './pages/trip-detail/trip-detail';
import { UserProfileComponent } from './pages/user-profile/user-profile';

import { authGuard } from './context-guards/auth.guard';

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
    path: 'viaje/:id',
    component: TripDetailComponent,
    canActivate: [authGuard],
  },
  {
    path: 'perfil',
    component: UserProfileComponent,
    canActivate: [authGuard],
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
