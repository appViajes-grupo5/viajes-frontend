import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      loginEmail: ['', [Validators.required, Validators.email]],
      loginPassword: ['', [Validators.required]]
    });
  }

  get email() { return this.loginForm.get('loginEmail'); }
  get password() { return this.loginForm.get('loginPassword'); }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.errorMessage = '';
    this.isLoading = true;

    const email = this.loginForm.value.loginEmail;
    const password = this.loginForm.value.loginPassword;

    this.authService.login(email, password).subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log('Login exitoso:', response);
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/viajes';
        this.router.navigate([returnUrl]);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error en login:', error);
        this.errorMessage = error.error?.error || 'Error al iniciar sesión. Por favor, intenta de nuevo.';
      }
    });
  }
}
