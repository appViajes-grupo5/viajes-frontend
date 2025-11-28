import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TripService } from '../../services/trip';
import { TripCardComponent } from '../../components/trip-card/trip-card';
import { Trip } from '../../models/trip.interface';

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
export class HomeComponent implements OnInit {
  tripService = inject(TripService);
  trips = signal<Trip[]>([]);

  ngOnInit() {
    this.tripService.getTrips().subscribe({
      next: (data) => {
        this.trips.set(data);
      },
      error: (err) => {
        console.error('Error cargando viajes', err);
      }
    });
  }
}
