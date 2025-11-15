// PASO 1: Importar las herramientas
import { Component, HostListener, HostBinding, OnInit, OnDestroy } from '@angular/core';
// ¡IMPORTANTE! Importamos RouterLink para que [routerLink] funcione en el HTML
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css']

})

export class HeaderComponent implements OnInit, OnDestroy {
  private isScrolled = false;
  isAuthenticated: boolean = false;
  userName: string = '';
  private authSubscription?: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  @HostBinding('class.navbar-scrolled')
  get applyNavbarScrolledClass(): boolean {
    return this.isScrolled;
  }

  @HostBinding('class.bg-transparent')
  get applyBgTransparentClass(): boolean {
    return !this.isScrolled;
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.isScrolled = window.scrollY > 50;
  }

  ngOnInit(): void {
    this.onWindowScroll();
    this.checkAuthStatus();
    
    this.authSubscription = this.authService.currentUser$.subscribe(user => {
      this.isAuthenticated = !!user;
      this.userName = user?.name || '';
    });
  }

  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe();
  }

  private checkAuthStatus(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userName = user.name;
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

