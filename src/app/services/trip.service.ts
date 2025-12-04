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

    // ==========================================
    // MÉTODOS DE ACCIÓN (POST, PUT, DELETE)
    // ==========================================

    // Unirse a un viaje (Reservar plaza)
    // POST /api/participants/join
    // Nota: Falta implementar cuando Manuel tenga su parte
    joinTrip(tripId: number): void {
    }

    // Eliminar un viaje
    // DELETE /api/trips/:id
    deleteTrip(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
