// PASO 1: Importar la herramienta 'Routes' de Angular
import { Routes } from '@angular/router';

// PASO 2: Importar TODOS los componentes de PÁGINA
// (¡CON LAS RUTAS CORREGIDAS!)

// ANTES (Incorrecto): import { HomeComponent } from './pages/home/home.component';
// DESPUÉS (Correcto):
import { HomeComponent } from './pages/home/home';

// ANTES: import { LoginComponent } from './pages/login/login.component';
// DESPUÉS:
import { LoginComponent } from './pages/login/login';

// ANTES: import { RegisterComponent } from './pages/register/register.component';
// DESPUÉS:
import { RegisterComponent } from './pages/register/register';

// ANTES: import { TripListComponent } from './pages/trip-list/trip-list.component';
// DESPUÉS:
import { TripListComponent } from './pages/trip-list/trip-list';

// ANTES: import { TripDetailComponent } from './pages/trip-detail/trip-detail.component';
// DESPUÉS:
import { TripDetailComponent } from './pages/trip-detail/trip-detail';

// ANTES: import { UserProfileComponent } from './pages/user-profile/user-profile.component';
// DESPUÉS:
import { UserProfileComponent } from './pages/user-profile/user-profile';


// PASO 3: Definir el array de rutas (el "mapa")
// (Esta parte estaba bien, no necesita cambios)
export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'viajes',
    component: TripListComponent
  },
  {
    path: 'viaje/:id',
    component: TripDetailComponent
  },
  {
    path: 'perfil',
    component: UserProfileComponent
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];
