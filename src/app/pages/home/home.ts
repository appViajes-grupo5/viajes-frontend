import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TripService } from '../../services/trip.service';
import { TripCardComponent } from '../../components/trip-card/trip-card';
import { Trip } from '../../models/trip.interface';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, TripCardComponent],
  templateUrl: './home.html',
  styles: [`
    .hero-section {
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    }
  `]
})
export class HomeComponent implements OnInit {
  tripService = inject(TripService);
  trips = signal<Trip[]>([]);
  isLoading = signal<boolean>(true);

  ngOnInit() {
    this.tripService.getTrips(undefined, 1, 6).subscribe({
      next: (data) => {
        this.trips.set(data.trips || []);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error cargando viajes', err);
        this.isLoading.set(false);
      }
    });
  }
}
