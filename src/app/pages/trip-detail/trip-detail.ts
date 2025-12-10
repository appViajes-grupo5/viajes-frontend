import { Component, inject, OnInit,signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TripService } from '../../services/trip.service';
import { AuthService } from '../../services/auth.service'; // Necesario para obtener el ID del usuario
import { Trip } from '../../models/trip.interface';
import { getTripImageUrl } from '../../utils/trip-image.util';
import { RatingFormComponent } from '../../components/rating-form/rating-form';

@Component({
  selector: 'app-trip-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, RatingFormComponent],
  templateUrl: './trip-detail.html',
  styleUrls: ['./trip-detail.css']
})
export class TripDetailComponent implements OnInit {
  // Inyección de dependencias
  private tripService = inject(TripService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);

  trip?: Trip; // Aquí guardamos los datos del viaje
  participants: any[] = []; // Lista de participantes
  isJoined: boolean = false; // Estado local: ¿El usuario está unido?
  currentUserId: number | null = null; // ID del usuario logueado
  
  // para ratings
  puedeValorar = signal<boolean>(true);   // visible por ahora
  usuarioAValorarId = signal<number>(0);  // sin funcionar por ahora

  ngOnInit() {
    // 1. Obtener usuario actual (si existe) para saber quién navega
    const user = this.authService.getCurrentUser();
    if (user) {
      this.currentUserId = user.id;
    }

    // 2. Obtener ID del viaje desde la URL
    const id = Number(this.route.snapshot.paramMap.get('id'));

    // 3. Cargar datos si el ID es válido
    if (id) {
      this.loadTripData(id);
    }
  }

  // Carga secuencial: Viaje -> Participantes
  loadTripData(id: number) {
    this.tripService.getTripById(id).subscribe({
      next: (trip) => {
        this.trip = trip;
        // Una vez tenemos el viaje, cargamos quién va
        this.loadParticipants(id);
      },
      error: (err) => {
        console.error('Error cargando el viaje', err);
        // Opcional: redirigir a 404 o home
        this.router.navigate(['/']);
      }
    });
  }

  // Cargar participantes y calcular si 'yo' estoy dentro
  loadParticipants(tripId: number) {
    this.tripService.getParticipants(tripId).subscribe({
      next: (data) => {
        this.participants = data;

        // Verificar si el usuario logueado está en la lista
        if (this.currentUserId) {
          // Asumimos que el backend devuelve objetos con 'user_id'
          this.isJoined = this.participants.some(p => p.user_id === this.currentUserId);
        }
      },
      error: (err) => console.error('Error cargando participantes', err)
    });
  }

  // Volver a la página anterior
  goBack() {
    this.location.back();
  }

  // Funcionalidad Reservar
  joinTrip() {
    if (!this.trip) return;

    // Si no está logueado, mandar al login
    if (!this.currentUserId) {
      alert('Debes iniciar sesión para unirte a un viaje.');
      this.router.navigate(['/login']);
      return;
    }

    this.tripService.joinTrip(this.trip.trip_id, this.currentUserId).subscribe({
      next: () => {
        alert('¡Te has unido al viaje con éxito!');
        // Recargar datos para ver mi foto en la lista y actualizar botones
        this.loadTripData(this.trip!.trip_id);
      },
      error: (err) => {
        console.error('Error al unirse:', err);
        alert('No se pudo completar la solicitud.');
      }
    });
  }

  // SALIR del viaje (Cancelar reserva)
  leaveTrip() {
    if (!this.trip || !this.currentUserId) return;

    if (!confirm('¿Estás seguro de que quieres cancelar tu plaza en este viaje?')) {
      return;
    }

    this.tripService.leaveTrip(this.trip.trip_id, this.currentUserId).subscribe({
      next: () => {
        alert('Has salido del viaje.');
        this.isJoined = false;
        // Recargar para quitar mi foto de la lista
        this.loadTripData(this.trip!.trip_id);
      },
      error: (err) => {
        console.error('Error al salir:', err);
        alert('Hubo un error al intentar salir del viaje.');
      }
    });
  }

  // ELIMINAR viaje (Solo debería ser visible para admin o creador)
  deleteTrip() {
    if (!this.trip) return;

    const confirmDelete = confirm(`¿Estás seguro de que quieres eliminar "${this.trip.title}"?`);

    if (confirmDelete) {
      this.tripService.deleteTrip(this.trip.trip_id).subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error('Error eliminando el viaje', err);
          alert('Hubo un error al eliminar el viaje');
        }
      });
    }
  }

  // Método para obtener imagen dinámica (igual que en trip-card)
  getImageUrl(): string {
    return this.trip ? getTripImageUrl(this.trip) : '';
  }
}
