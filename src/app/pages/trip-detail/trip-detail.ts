import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TripService } from '../../services/trip.service';
import { AuthService } from '../../services/auth.service';
import { RatingsService } from '../../services/ratings.service';
import { Trip } from '../../models/trip.interface';
import { getTripImageUrl } from '../../utils/trip-image.util';
import { RatingFormComponent } from '../../components/rating-form/rating-form';
import { TripCommentsComponent } from '../../components/trip-comments/trip-comments';

@Component({
  selector: 'app-trip-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, RatingFormComponent, TripCommentsComponent],
  templateUrl: './trip-detail.html',
  styleUrls: ['./trip-detail.css']
})
export class TripDetailComponent implements OnInit {
  private tripService = inject(TripService);
  private authService = inject(AuthService);
  private ratingsService = inject(RatingsService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);

  trip?: Trip;
  participants: any[] = [];
  existingRatings: any[] = [];
  
  currentUserId: number | null = null;

  isCreator: boolean = false;
  isJoined: boolean = false;
  isApproved: boolean = false;

  puedeValorar = signal<boolean>(false);
  usuariosParaValorar = signal<any[]>([]);
  selectedUserToRate = signal<number | null>(null);
  
  tripStatus = signal<'upcoming' | 'ongoing' | 'finished'>('upcoming');
  puedeUnirse = signal<boolean>(true);

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
        if (this.trip && this.currentUserId) {
          this.isCreator = Number(this.trip.creator_id) === Number(this.currentUserId);
        }
        this.calcularPuedeUnirse();
        this.loadParticipants(id);
      },
      error: (err) => {
        console.error('Error cargando el viaje', err);
        this.router.navigate(['/']);
      }
    });
  }

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

        this.loadRatings(tripId);
      },
      error: (err) => console.error('Error cargando participantes', err)
    });
  }

  isRefreshingRatings = signal<boolean>(false);

  loadRatings(tripId: number) {
    this.ratingsService.getRatingsForTrip(tripId).subscribe({
      next: (ratings) => {
        this.existingRatings = ratings || [];
        this.calcularPuedeValorar();
        this.isRefreshingRatings.set(false);
      },
      error: (err) => {
        console.error('Error cargando calificaciones', err);
        this.existingRatings = [];
        this.calcularPuedeValorar();
        this.isRefreshingRatings.set(false);
      }
    });
  }

  calcularPuedeValorar() {
    if (!this.trip || !this.currentUserId) {
      this.puedeValorar.set(false);
      this.calcularPuedeUnirse();
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = new Date(this.trip.start_date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(this.trip.end_date);
    endDate.setHours(0, 0, 0, 0);

    if (today < startDate) {
      this.tripStatus.set('upcoming');
    } else if (today >= startDate && today <= endDate) {
      this.tripStatus.set('ongoing');
    } else {
      this.tripStatus.set('finished');
    }

    this.calcularPuedeUnirse();

    const tripFinished = this.tripStatus() === 'finished';

    if (!tripFinished || !this.isApproved) {
      this.puedeValorar.set(false);
      this.usuariosParaValorar.set([]);
      return;
    }

    const approvedParticipants = this.participants.filter(
      p => (p.status === 'approved' || p.status === 'accepted') && Number(p.user_id) !== Number(this.currentUserId)
    );

    const creatorIsApproved = this.trip.creator_id && 
      Number(this.trip.creator_id) !== Number(this.currentUserId) &&
      (this.isCreator || approvedParticipants.some(p => Number(p.user_id) === Number(this.trip?.creator_id)));

    const usuariosDisponibles: any[] = [];

    if (creatorIsApproved) {
      const yaValoradoAlCreador = this.existingRatings.some(
        r => Number(r.rater_user_id) === Number(this.currentUserId) && Number(r.rated_user_id) === Number(this.trip?.creator_id)
      );
      if (!yaValoradoAlCreador) {
        usuariosDisponibles.push({
          user_id: this.trip.creator_id,
          first_name: this.trip.creator_first_name || 'Creador',
          last_name: this.trip.creator_last_name || '',
          isCreator: true
        });
      }
    }

    approvedParticipants.forEach(participant => {
      const yaValorado = this.existingRatings.some(
        r => Number(r.rater_user_id) === Number(this.currentUserId) && Number(r.rated_user_id) === Number(participant.user_id)
      );
      if (!yaValorado) {
        usuariosDisponibles.push({
          user_id: participant.user_id,
          first_name: participant.first_name || participant.firstName,
          last_name: participant.last_name || participant.lastName,
          isCreator: false
        });
      }
    });

    this.usuariosParaValorar.set(usuariosDisponibles);
    this.puedeValorar.set(usuariosDisponibles.length > 0);

    if (usuariosDisponibles.length > 0) {
      const usuarioActual = this.selectedUserToRate();
      const usuarioSigueDisponible = usuariosDisponibles.some(
        u => Number(u.user_id) === Number(usuarioActual)
      );
      
      if (!usuarioSigueDisponible || !usuarioActual) {
        this.selectedUserToRate.set(usuariosDisponibles[0].user_id);
      }
    } else {
      this.selectedUserToRate.set(null);
    }
  }

  onRatingSubmitted = () => {
    if (!this.trip) return;
    
    this.isRefreshingRatings.set(true);
    this.loadRatings(this.trip.trip_id);
  }

  selectUserToRate(userId: number) {
    this.selectedUserToRate.set(userId);
  }

  calcularPuedeUnirse() {
    if (!this.trip) {
      this.puedeUnirse.set(false);
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = new Date(this.trip.start_date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(this.trip.end_date);
    endDate.setHours(0, 0, 0, 0);

    const puedeUnirse = today < startDate;
    this.puedeUnirse.set(puedeUnirse);
  }

  // Volver a la página anterior
  goBack() {
    this.location.back();
  }

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

    if (!this.puedeUnirse()) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const startDate = new Date(this.trip.start_date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(this.trip.end_date);
      endDate.setHours(0, 0, 0, 0);

      if (today >= startDate) {
        alert('No puedes unirte a un viaje que ya ha comenzado.');
      } else if (today > endDate) {
        alert('No puedes unirte a un viaje que ya ha finalizado.');
      }
      return;
    }

    this.tripService.joinTrip(this.trip.trip_id, this.currentUserId).subscribe({
      next: () => {
        alert('¡Solicitud enviada! Tu estado ahora es pendiente.');
        this.loadTripData(this.trip!.trip_id);
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

    // No permitir salir si el viaje ya comenzó o finalizó
    if (this.tripStatus() === 'ongoing' || this.tripStatus() === 'finished') {
      alert('No puedes cancelar tu plaza porque el viaje ya comenzó o finalizó.');
      return;
    }

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

  // Aceptar solicitud de participante
  approveParticipant(userId: number) {
    if (!this.trip) return;
    this.tripService.updateParticipantStatus(this.trip.trip_id, userId, 'approved').subscribe({
      next: () => {
        this.loadParticipants(this.trip!.trip_id);
      },
      error: (err) => {
        console.error('Error aprobando participante', err);
        alert(err.error?.error || 'Error al aprobar participante');
      }
    });
  }

  // Rechazar solicitud de participante
  rejectParticipant(userId: number) {
    if (!this.trip) return;
    if (!confirm('¿Estás seguro de rechazar esta solicitud?')) return;
    
    this.tripService.updateParticipantStatus(this.trip.trip_id, userId, 'rejected').subscribe({
      next: () => {
        this.loadParticipants(this.trip!.trip_id);
      },
      error: (err) => {
        console.error('Error rechazando participante', err);
        alert(err.error?.error || 'Error al rechazar participante');
      }
    });
  }

  // Método para obtener imagen dinámica (igual que en trip-card)
  getImageUrl(): string {
    return this.trip ? getTripImageUrl(this.trip) : '';
  }
}
