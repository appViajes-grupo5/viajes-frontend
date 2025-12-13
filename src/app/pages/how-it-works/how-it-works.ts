import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-how-it-works',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './how-it-works.html',
  styleUrl: './how-it-works.css'
})
export class HowItWorksComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoggedIn(): boolean {
    return !!this.authService.getCurrentUser();
  }

  handleStartClick() {
    if (this.isLoggedIn()) {
      this.router.navigate(['/mis-viajes']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}

