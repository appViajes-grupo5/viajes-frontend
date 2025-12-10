import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Rating {
  id: number;
  trip_id: number;
  user_id: number;        // usuario que realiza la valoracion
  rated_user_id: number;  // usuario valorado
  score: number;
  comment: string;
  created_at: string;
}

export interface CreateRatingDto {
  trip_id: number;
  rated_user_id: number;
  score: number;
  comment: string;
}

@Injectable({
  providedIn: 'root'
})
export class RatingsService {
  private apiUrl = `${environment.apiUrl}/ratings`;

  constructor(private http: HttpClient) {}

  // Crear valoracion
  createRating(body: CreateRatingDto): Observable<any> {
    return this.http.post(`${this.apiUrl}`, body);
  }

  // Obtener valoraciones de un viaje
  getRatingsForTrip(tripId: number): Observable<Rating[]> {
    return this.http.get<Rating[]>(`${this.apiUrl}/trip/${tripId}`);
  }

  // Obtener valoraciones recibidas por un usuario
  getRatingsForUser(userId: number): Observable<Rating[]> {
    return this.http.get<Rating[]>(`${this.apiUrl}/user/${userId}`);
  }

  // Obtener valoración por ID
  getRating(id: number): Observable<Rating> {
    return this.http.get<Rating>(`${this.apiUrl}/${id}`);
  }
}