import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Trip } from '../models/trip.interface';

@Injectable({
  providedIn: 'root'
})
export class TripService {

  private apiUrl = 'http://localhost:4000/api/trips';

  constructor(private http: HttpClient) { }

  // Obtener todos los viajes
  getTrips(): Observable<Trip[]> {
    return this.http.get<Trip[]>(this.apiUrl);
  }

  // Obtener un solo viaje por ID
  getTripById(id: number): Observable<Trip> {
    return this.http.get<Trip>(`${this.apiUrl}/${id}`);
  }

  // Crear un nuevo viaje
  addTrip(trip: Trip): Observable<any> {
    return this.http.post(this.apiUrl, trip);
  }

  // Editar un viaje existente
  updateTrip(trip: Trip): Observable<any> {
    // Asumimos que el backend espera el ID en la URL y el objeto en el body
    // Si el objeto trip tiene el ID, lo usamos.
    return this.http.put(`${this.apiUrl}/${trip.trip_id}`, trip);
  }

  // Borrar viaje
  deleteTrip(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
