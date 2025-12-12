import { Component, input } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router'; // Para poder navegar al detalle
import { Trip } from '../../models/trip.interface';
import { getTripImageUrl } from '../../utils/trip-image.util';

@Component({
  selector: 'app-trip-card',
  standalone: true,
  // Importamos lo que vamos a usar en el HTML
  imports: [CommonModule, DatePipe, CurrencyPipe, RouterLink],
  templateUrl: './trip-card.html',
  styles: [`
    /* Estilos encapsulados solo para la tarjeta */
    .trip-card {
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      cursor: pointer;
    }
    .trip-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 20px rgba(0,0,0,0.15) !important;
    }
    .card-img-top {
      height: 200px;
      object-fit: cover;
    }
  `]
})
export class TripCardComponent {
  // Input obligatorio (Signal).
  // En el HTML accederemos a él como trip() (con paréntesis)
  trip = input.required<Trip>();

  // Método para obtener imagen dinámica
  getImageUrl(): string {
    const t = this.trip();
    if (!t || !t.trip_id) {
      console.warn('Trip invalido o sin ID:', t);
      return 'assets/placeholder.jpg'; // Fallback local si existiera
    }
    return getTripImageUrl(t);
  }
}
