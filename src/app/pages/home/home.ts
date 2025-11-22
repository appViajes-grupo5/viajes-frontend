import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TripService } from '../../services/trip';
import { TripCardComponent } from '../../components/trip-card/trip-card';

@Component({
  selector: 'app-home',
  standalone: true,
  // IMPORTANTE: Aquí declaramos qué usa este componente
  imports: [CommonModule, RouterLink, TripCardComponent],
  templateUrl: './home.html',
  styles: [`
    /* Un pequeño estilo para el header si no usas clases de Bootstrap puras */
    .hero-section {
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    }
  `]
})
export class HomeComponent {
  // Conectamos con el servicio.
  // En el HTML usaremos tripService.trips() para leer la signal.
  tripService = inject(TripService);
}
