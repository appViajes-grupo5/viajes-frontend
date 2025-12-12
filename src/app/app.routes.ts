import { Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';
import { TripListComponent } from './pages/trip-list/trip-list';
import { TripDetailComponent } from './pages/trip-detail/trip-detail';
import { UserProfileComponent } from './pages/user-profile/user-profile';
import { authGuard } from './context-guards/auth.guard';
import { TripFormComponent } from './pages/trip-form/trip-form';
import { ForoComponent } from './pages/foro/foro';
import { ForoDetailComponent } from './pages/foro-detail/foro-detail';
import { TripMyListComponent } from './pages/my-trip-list/trip-list';


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
    path: 'viaje/:id',
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
    path: 'foro',
    component: ForoComponent,
  },
  {
    path: 'foro/:id',
    component: ForoDetailComponent,
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
