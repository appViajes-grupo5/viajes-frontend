import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { NotificationsService, Notification } from '../../services/notifications.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './notifications.html',
  styleUrls: ['./notifications.css']
})
export class NotificationsComponent implements OnInit, OnDestroy {
  private notificationsService = inject(NotificationsService);
  private router = inject(Router);
  
  notifications = signal<Notification[]>([]);
  unreadCount = signal<number>(0);
  isOpen = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  private subscriptions = new Subscription();

  ngOnInit() {
    this.notificationsService.initialize();

    this.subscriptions.add(
      this.notificationsService.notifications$.subscribe(notifications => {
        this.notifications.set(notifications);
        const unread = notifications.filter(n => !n.is_read).length;
        this.unreadCount.set(unread);
      })
    );

    this.subscriptions.add(
      this.notificationsService.unreadCount$.subscribe(count => {
        this.unreadCount.set(count);
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  loadNotifications() {
    this.isLoading.set(true);
    this.notificationsService.refreshNotifications();
    setTimeout(() => this.isLoading.set(false), 300);
  }

  toggleDropdown() {
    this.isOpen.update(open => !open);
    if (this.isOpen()) {
      this.loadNotifications();
    }
  }

  closeDropdown() {
    this.isOpen.set(false);
  }

  markAsRead(notification: Notification, event: Event) {
    event.stopPropagation();
    if (notification.is_read) return;

    this.notificationsService.markAsRead(notification.notification_id).subscribe({
      next: (updated) => {
        this.notifications.update(notifications => 
          notifications.map(n => 
            n.notification_id === notification.notification_id 
              ? { ...n, is_read: 1 } 
              : n
          )
        );
        this.notificationsService.refreshNotifications();
      },
      error: (err) => console.error('Error marcando como leída:', err)
    });
  }

  deleteNotification(notificationId: number, event: Event) {
    event.stopPropagation();
    if (!confirm('¿Eliminar esta notificación?')) return;

    this.notificationsService.deleteNotification(notificationId).subscribe({
      next: () => {
        this.notifications.update(notifications => 
          notifications.filter(n => n.notification_id !== notificationId)
        );
        this.notificationsService.refreshNotifications();
      },
      error: (err) => console.error('Error eliminando notificación:', err)
    });
  }

  handleNotificationClick(notification: Notification) {
    if (!notification.is_read) {
      this.markAsRead(notification, new Event('click'));
    }
    
    this.closeDropdown();
    
    if (notification.link) {
      this.router.navigateByUrl(notification.link);
    }
  }

  markAllAsRead() {
    const unreadNotifications = this.notifications().filter(n => !n.is_read);
    unreadNotifications.forEach(notification => {
      this.notificationsService.markAsRead(notification.notification_id).subscribe({
        error: (err) => console.error('Error marcando como leída:', err)
      });
    });
    this.notificationsService.refreshNotifications();
  }
}

