import { Routes } from '@angular/router';

import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { TripList } from './pages/trip-list/trip-list';
import { TripDetail } from './pages/trip-detail/trip-detail';
import { UserProfile } from './pages/user-profile/user-profile';

export const routes: Routes = [
    { path: '', component: Home }, 
  { path: 'login', component: Login }, 
  { path: 'registro', component: Register }, 
  { path: 'viajes', component: TripList }, 
  { path: 'viajes/:id', component: TripDetail }, 
  { path: 'perfil', component: UserProfile },
  { path: '**', redirectTo: '' }
];
