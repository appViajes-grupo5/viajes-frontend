import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TripService } from '../../services/trip.service';
import { Trip } from '../../models/trip.interface';
import { getTripImageUrl } from '../../utils/trip-image.util';
import { TripFiltersComponent, TripFilters } from '../../components/trip-filters/trip-filters';
import { TripPaginationComponent } from '../../components/trip-pagination/trip-pagination';

@Component({
  selector: 'app-trip-list',
  standalone: true,
  imports: [CommonModule, RouterLink, TripFiltersComponent, TripPaginationComponent],
  templateUrl: './trip-list.html',
  styleUrls: ['./trip-list.css'],
})
export class TripListComponent implements OnInit {
  userName: string = '';
  trips: Trip[] = [];
  currentPage = signal<number>(1);
  totalPages = signal<number>(1);
  total = signal<number>(0);
  limit = 20;
  isLoading = signal<boolean>(false);
  filters = signal<TripFilters | null>(null);

  constructor(
    private authService: AuthService,
    private tripService: TripService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userName = user.name;
    }
    this.loadTrips();
  }

  loadTrips() {
    this.isLoading.set(true);
    this.tripService.getTrips(this.filters(), this.currentPage(), this.limit).subscribe({
      next: (data) => {
        this.trips = data.trips || [];
        this.totalPages.set(data.totalPages || 1);
        this.total.set(data.total || 0);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error al obtener viajes', err);
        this.isLoading.set(false);
      },
    });
  }

  onFiltersChange(filters: TripFilters) {
    this.filters.set(filters);
    this.currentPage.set(1);
    this.loadTrips();
  }

  onClearFilters() {
    this.filters.set(null);
    this.currentPage.set(1);
    this.loadTrips();
  }

  onPageChange(page: number) {
    this.currentPage.set(page);
    this.loadTrips();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  getImageUrl(trip: Trip): string {
    return getTripImageUrl(trip);
  }
}
