import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TripService } from '../../services/trip.service';
import { Trip } from '../../models/trip.interface';

@Component({
  selector: 'app-trip-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './trip-list.html',
  styleUrls: ['./trip-list.css']
})
export class TripListComponent implements OnInit {
  userName: string = '';
  trips: Trip[] = [];

  constructor(
    private authService: AuthService,
    private tripService: TripService
  ) { }

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userName = user.name;
    }

    this.tripService.getTrips().subscribe({
      next: (data) => {
        this.trips = data;
      },
      error: (err) => {
        console.error('Error al obtener viajes', err);
      }
    });
  }
}
