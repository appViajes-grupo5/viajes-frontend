import { Component, inject, OnInit, signal } from '@angular/core';
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
  
  currentUserId: number | null = null; // ID del usuario logueado

  isCreator: boolean = false;
  isJoined: boolean = false; // Estado local: ¿El usuario está unido?
  isApproved: boolean = false; // Nuevo: Solo si el status es 'approved'

  // para ratings
  puedeValorar = signal<boolean>(true);   // visible por ahora
  usuarioAValorarId = signal<number>(0);  // sin funcionar por ahora, en el futuro para valorar participantes

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
        // Calcular si soy el creador (usando conversión a número por seguridad)
        if (this.trip && this.currentUserId) {
          this.isCreator = Number(this.trip.creator_id) === Number(this.currentUserId);
        }
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
        this.isJoined = false;
        this.isApproved = false;

        if (this.currentUserId) {
          const myRecord = this.participants.find(p => p.user_id === this.currentUserId);
          if (myRecord) {
            this.isJoined = true;
            this.isApproved = myRecord.status === 'accepted' || myRecord.status === 'approved';
          }
        }

        // Calcular lógica de valoración
        this.calcularPuedeValorar();
      },
      error: (err) => console.error('Error cargando participantes', err)
    });
  }

  calcularPuedeValorar() {
    if (!this.trip) return;

    const today = new Date();
    const endDate = new Date(this.trip.end_date);
    
    // Condición 1: El viaje debe haber terminado
    const tripFinished = today > endDate;

    // Condición 2: El usuario debe ser participante APROBADO (no creador, el creador no se valora a sí mismo aquí)
    // Aquí asumimos valoración al CREADOR o al VIAJE en general.
    
    if (tripFinished && this.isApproved) {
        this.puedeValorar.set(true);
        // Si valoramos al creador:
        if (this.trip.creator_id) {
            this.usuarioAValorarId.set(this.trip.creator_id);
        }
    } else {
        this.puedeValorar.set(false);
    }
  }

  // Volver a la página anterior
  goBack() {
    this.location.back();
  }

  // Funcionalidad Reservar
  joinTrip() {
    if (!this.trip) return;

    if (!this.currentUserId) {
      alert('Debes iniciar sesión para unirte.');
      this.router.navigate(['/login']);
      return;
    }
    
    if (this.isCreator) {
        alert('Eres el creador del viaje, no necesitas unirte.');
        return;
    }

    this.tripService.joinTrip(this.trip.trip_id, this.currentUserId).subscribe({
      next: () => {
        alert('¡Solicitud enviada! Tu estado ahora es pendiente.');
        this.loadTripData(this.trip!.trip_id); // Recargar para actualizar UI
      },
      error: (err) => {
        console.error('Error al unirse:', err);
        const msg = err.error?.error || 'Error al intentar unirse al viaje.';
        alert(msg);
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
        this.isApproved = false;
        this.puedeValorar.set(false);
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

    if (!confirm(`¿Estás seguro de eliminar el viaje "${this.trip.title}"? Esta acción no se puede deshacer.`)) return;

    this.tripService.deleteTrip(this.trip.trip_id).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Error eliminando viaje', err);
        alert('Error eliminando el viaje.');
      }
    });
  }

  // Método para obtener imagen dinámica (igual que en trip-card)
  getImageUrl(): string {
    return this.trip ? getTripImageUrl(this.trip) : '';
  }
}
