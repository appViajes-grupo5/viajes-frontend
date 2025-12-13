import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TripService } from '../../services/trip.service';
import { Trip } from '../../models/trip.interface';
import { getTripImageUrl } from '../../utils/trip-image.util';
import { TripFormComponent } from '../../components/trip/create/trip-form';
import { TripEditFormComponent } from '../../components/trip/editar/trip-form';
import { TripFiltersComponent, TripFilters } from '../../components/trip-filters/trip-filters';
import { TripPaginationComponent } from '../../components/trip-pagination/trip-pagination';
declare var bootstrap: any;

@Component({
  selector: 'app-trip-my-list',
  standalone: true,
  imports: [CommonModule, RouterLink, TripFormComponent, TripEditFormComponent, TripFiltersComponent, TripPaginationComponent],
  templateUrl: './trip-list.html',
  styleUrls: ['./trip-list.css'],
})
export class TripMyListComponent implements OnInit {
  userName: string = '';
  trips: Trip[] = [];
  loading = signal<boolean>(false);
  selectTrip: number | null = null;
  currentPage = signal<number>(1);
  totalPages = signal<number>(1);
  total = signal<number>(0);
  limit = 20;
  filters = signal<TripFilters | null>(null);

  constructor(
    private authService: AuthService,
    private tripService: TripService
  ) {}

  ngOnInit(): void {
    this.loading.set(true);
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userName = user.name;
    }
    this.cargarViajes();
  }

  ngAfterViewInit(): void {
    const modalEl = document.getElementById('modalViaje');

    modalEl?.addEventListener('hidden.bs.modal', () => {
      this.selectTrip = null;
    });
  }

  cargarViajes() {
    this.loading.set(true);
    this.tripService.getMyTrips(this.filters(), this.currentPage(), this.limit).subscribe({
      next: (data) => {
        this.trips = data.trips || [];
        this.totalPages.set(data.totalPages || 1);
        this.total.set(data.total || 0);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error al obtener viajes', err);
        this.loading.set(false);
      },
    });
    this.selectTrip = null;
  }

  onFiltersChange(filters: TripFilters) {
    this.filters.set(filters);
    this.currentPage.set(1);
    this.cargarViajes();
  }

  onClearFilters() {
    this.filters.set(null);
    this.currentPage.set(1);
    this.cargarViajes();
  }

  onPageChange(page: number) {
    this.currentPage.set(page);
    this.cargarViajes();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  abrirModalEditarTrip(idTrip: number) {
    this.selectTrip = idTrip;
  }
  
  deleteTrip(idTrip: number) {
  if (!idTrip) return;

  const confirmDelete = confirm('¿Seguro que deseas eliminar este viaje?');
  if (!confirmDelete) return;

  this.tripService.deleteTrip(idTrip).subscribe({
    next: () => {
      this.trips = this.trips.filter(t => t.trip_id !== idTrip);

      if (this.selectTrip === idTrip) {
        this.selectTrip = null;

        const modalEl = document.getElementById('modalViaje');
        const modalInstance = bootstrap.Modal.getInstance(modalEl);
        modalInstance?.hide();
      }

      alert('Viaje eliminado correctamente.');
    },
    error: (err) => {
      console.error('Error al eliminar viaje', err);
      const msg = err?.error?.message || 'Hubo un error al eliminar el viaje.';
      alert(msg);
    }
  });
}
  getImageUrl(trip: Trip): string {
    return getTripImageUrl(trip);
  }

  formatDate(date: string | Date): string {
    const d = new Date(date);
    return d.toLocaleDateString();
  }
  

}
