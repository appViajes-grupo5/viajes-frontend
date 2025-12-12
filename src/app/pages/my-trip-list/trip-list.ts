import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TripService } from '../../services/trip.service';
import { Trip } from '../../models/trip.interface';
import { getTripImageUrl } from '../../utils/trip-image.util';

@Component({
  selector: 'app-trip-my-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './trip-list.html',
  styleUrls: ['./trip-list.css'],
})
export class TripMyListComponent implements OnInit {
  userName: string = '';
  trips: Trip[] = [];
  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private tripService: TripService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userName = user.name;
    }

    this.tripService.getMyTrips().subscribe({
      next: (data) => {
        this.trips = data;
      },
      error: (err) => {
        console.error('Error al obtener viajes', err);
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  getImageUrl(trip: Trip): string {
    return getTripImageUrl(trip);
  }
}
