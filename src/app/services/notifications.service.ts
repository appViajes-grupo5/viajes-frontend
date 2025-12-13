import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, interval } from 'rxjs';
import { environment } from '../../environments/environment';
import { startWith, switchMap } from 'rxjs/operators';

export interface Notification {
  notification_id: number;
  user_id: number;
  message: string;
  link: string | null;
  is_read: number;
  created_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private apiUrl = `${environment.apiUrl}/notifications`;
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();
  private unreadCountSubject = new BehaviorSubject<number>(0);
  public unreadCount$ = this.unreadCountSubject.asObservable();

  constructor(private http: HttpClient) {}

  initialize(): void {
    if (this.isAuthenticated()) {
      this.loadNotifications();
      this.startPolling();
    }
  }

  private isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  private startPolling(): void {
    interval(30000).pipe(
      switchMap(() => this.getMyNotifications())
    ).subscribe({
      next: (notifications) => {
        this.notificationsSubject.next(notifications);
        const unread = notifications.filter(n => !n.is_read).length;
        this.unreadCountSubject.next(unread);
      },
      error: (err) => console.error('Error polling notifications:', err)
    });
  }

  private loadNotifications(): void {
    this.getMyNotifications().subscribe({
      next: (notifications) => {
        this.notificationsSubject.next(notifications);
        const unread = notifications.filter(n => !n.is_read).length;
        this.unreadCountSubject.next(unread);
      },
      error: (err) => console.error('Error loading notifications:', err)
    });
  }

  getMyNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.apiUrl}/me`);
  }

  markAsRead(notificationId: number): Observable<Notification> {
    return this.http.put<Notification>(`${this.apiUrl}/${notificationId}/read`, {});
  }

  deleteNotification(notificationId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${notificationId}`);
  }

  refreshNotifications(): void {
    this.getMyNotifications().subscribe({
      next: (notifications) => {
        this.notificationsSubject.next(notifications);
        const unread = notifications.filter(n => !n.is_read).length;
        this.unreadCountSubject.next(unread);
      },
      error: (err) => console.error('Error refreshing notifications:', err)
    });
  }
}

