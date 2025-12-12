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

    // Obtener todos los viajes disponibles
    // GET /api/trips
    getTrips(): Observable<Trip[]> {
        return this.http.get<Trip[]>(this.apiUrl);
    }

    // Obtener el detalle de un viaje por su ID
    // GET /api/trips/:id
    getTripById(id: number): Observable<Trip> {
        return this.http.get<Trip>(`${this.apiUrl}/${id}`);
    }
    // NUEVO: Obtener participantes de un viaje
    getParticipants(tripId: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/${tripId}/participants`);
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
    // Modificación: Implementación real. DELETE con body requiere opciones especiales en Angular
    // CORRECCIÓN: Backend espera 'tripId' y ruta /leave
    leaveTrip(tripId: number, userId: number): Observable<any> {
        return this.http.delete(`${this.participantsUrl}/leave`, { body: { tripId } });
    }

    // Eliminar un viaje
    // DELETE /api/trips/:id
    deleteTrip(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
