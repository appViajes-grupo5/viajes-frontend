import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Trip } from '../models/trip.interface';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class TripService {
    // URL base del backend para los viajes
    private apiUrl = `${environment.apiUrl}/trips`;
    // URL para la gestión de participantes
    private participantsUrl = `${environment.apiUrl}/participants`;

    constructor(
        private http: HttpClient,
        private authService: AuthService
    ) { }

    // ==========================================
    // MÉTODOS DE LECTURA (GET)
    // ==========================================

    getTrips(filters?: any, page: number = 1, limit: number = 20): Observable<any> {
        let params: any = { page, limit };
        if (filters) {
            if (filters.destination) params.destination = filters.destination;
            if (filters.startDateFrom) params.startDateFrom = filters.startDateFrom;
            if (filters.startDateTo) params.startDateTo = filters.startDateTo;
            if (filters.endDateFrom) params.endDateFrom = filters.endDateFrom;
            if (filters.endDateTo) params.endDateTo = filters.endDateTo;
            if (filters.minCost) params.minCost = filters.minCost;
            if (filters.maxCost) params.maxCost = filters.maxCost;
            if (filters.sortBy) params.sortBy = filters.sortBy;
            if (filters.sortOrder) params.sortOrder = filters.sortOrder;
        }
        return this.http.get<any>(this.apiUrl, { params });
    }

    getMyTrips(filters?: any, page: number = 1, limit: number = 20): Observable<any> {
        let params: any = { page, limit };
        if (filters) {
            if (filters.destination) params.destination = filters.destination;
            if (filters.startDateFrom) params.startDateFrom = filters.startDateFrom;
            if (filters.startDateTo) params.startDateTo = filters.startDateTo;
            if (filters.endDateFrom) params.endDateFrom = filters.endDateFrom;
            if (filters.endDateTo) params.endDateTo = filters.endDateTo;
            if (filters.minCost) params.minCost = filters.minCost;
            if (filters.maxCost) params.maxCost = filters.maxCost;
            if (filters.sortBy) params.sortBy = filters.sortBy;
            if (filters.sortOrder) params.sortOrder = filters.sortOrder;
        }
        return this.http.get<any>(`${this.apiUrl}/me`, { params });
    }

    // Obtener el detalle de un viaje por su ID
    // GET /api/trips/:id
    getTripById(id: number): Observable<Trip> {
        return this.http.get<Trip>(`${this.apiUrl}/${id}`);
    }
    // NUEVO: Obtener participantes de un viaje
    getParticipants(tripId: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.participantsUrl}/trip/${tripId}`);
    }

    // ==========================================
    // NUEVOS MÉTODOS PARA PARTICIPANTES
    // ==========================================


    // Unirse a un viaje
    // Modificación: Ahora devuelve un Observable y requiere userId (aunque el backend lo saca del token, lo pasamos por si acaso o lo quitamos)
    // CORRECCIÓN: Backend espera 'tripId' (camelCase) y ruta /join
    joinTrip(tripId: number, userId: number): Observable<any> {
        return this.http.post(`${this.participantsUrl}/join`, { tripId });
    }

    // Salir de un viaje
    leaveTrip(tripId: number, userId: number): Observable<any> {
        return this.http.delete(`${this.participantsUrl}/leave`, { body: { tripId } });
    }

    // Aceptar o rechazar solicitud de participante (solo creador)
    updateParticipantStatus(tripId: number, userId: number, status: 'approved' | 'rejected'): Observable<any> {
        return this.http.put(`${this.participantsUrl}/status`, { tripId, userId, status });
    }

    // Eliminar un viaje
    // DELETE /api/trips/:id
    deleteTrip(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    // Creación de viaje (POST)
    createTrip(trip: Trip): Observable<any> {
        // En el backend: router.post('/', verifyToken, tripController.createTrip);
        return this.http.post(this.apiUrl, trip);
    }

    // Edición de viaje (PUT)
    updateTrip(trip: Trip): Observable<any> {
        // En el backend: router.put('/:id', verifyToken, tripController.updateTrip);
        // trip.trip_id debe existir
        return this.http.put(`${this.apiUrl}/${trip.trip_id}`, trip);
    }
}
