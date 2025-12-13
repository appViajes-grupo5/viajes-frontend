import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface TripComment {
  comment_id: number;
  trip_id: number;
  user_id: number;
  comment_text: string;
  created_at: string;
  first_name?: string;
  last_name?: string;
  profile_picture_url?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TripCommentsService {
  private apiUrl = `${environment.apiUrl}/trip-comments`;

  constructor(private http: HttpClient) {}

  getCommentsByTrip(tripId: number): Observable<TripComment[]> {
    return this.http.get<TripComment[]>(`${this.apiUrl}/${tripId}`);
  }

  createComment(tripId: number, commentText: string): Observable<TripComment> {
    return this.http.post<TripComment>(this.apiUrl, {
      trip_id: tripId,
      comment_text: commentText
    });
  }

  updateComment(commentId: number, commentText: string): Observable<TripComment> {
    return this.http.put<TripComment>(`${this.apiUrl}/${commentId}`, {
      comment_text: commentText
    });
  }

  deleteComment(commentId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${commentId}`);
  }
}

