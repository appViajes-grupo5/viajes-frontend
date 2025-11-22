import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface LoginResponse {
  id: number;
  name: string;
  email: string;
  token: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(this.getStoredUser());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(response => {
          // Guardar token y usuario en localStorage
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify({
            id: response.id,
            name: response.name,
            email: response.email
          }));
          this.currentUserSubject.next({
            id: response.id,
            name: response.name,
            email: response.email
          });
        })
      );
  }

  register(email: string, password: string, firstName: string, lastName?: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/register`, {
      email,
      password,
      firstName,
      lastName
    })
      .pipe(
        tap(response => {
          // Guardar token y usuario en localStorage
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify({
            id: response.id,
            name: response.name,
            email: response.email
          }));
          this.currentUserSubject.next({
            id: response.id,
            name: response.name,
            email: response.email
          });
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  private getStoredUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  }

  getCurrentUserFromApi(): Observable<any> {
    const token = this.getToken();
    if (!token) {
      throw new Error('No hay token disponible');
    }

    const apiUrl = environment.apiUrl;
    return this.http.get<any>(`${apiUrl}/users/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  updateUser(userData: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    bio?: string;
    interests?: string;
    profilePictureUrl?: string;
  }): Observable<any> {
    const token = this.getToken();
    if (!token) {
      throw new Error('No hay token disponible');
    }

    const apiUrl = environment.apiUrl;
    return this.http.put<any>(`${apiUrl}/users/me`, userData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).pipe(
      tap(response => {
        // Actualizar el usuario en localStorage y observable
        const updatedUser = {
          id: response.id,
          name: `${response.firstName} ${response.lastName || ''}`.trim(),
          email: response.email
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        this.currentUserSubject.next(updatedUser);
      })
    );
  }
}

