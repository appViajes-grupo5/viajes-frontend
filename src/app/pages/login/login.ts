import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
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

    // Leer parámetros de la URL para mostrar mensajes
    this.route.queryParams.subscribe(params => {
      if (params['message'] === 'cuenta_confirmada') {
        this.successMessage = '¡Cuenta confirmada exitosamente! Ya puedes iniciar sesión.';
      } else if (params['message'] === 'cuenta_ya_confirmada') {
        this.successMessage = 'Tu cuenta ya estaba confirmada. Puedes iniciar sesión.';
      } else if (params['error'] === 'token_expirado') {
        this.errorMessage = 'El enlace de confirmación ha expirado. Por favor, regístrate nuevamente.';
      } else if (params['error'] === 'token_invalido') {
        this.errorMessage = 'El enlace de confirmación no es válido. Por favor, verifica el enlace o regístrate nuevamente.';
      } else if (params['error'] === 'usuario_no_encontrado') {
        this.errorMessage = 'Usuario no encontrado. Por favor, regístrate nuevamente.';
      } else if (params['error'] === 'error_confirmacion') {
        this.errorMessage = 'Error al confirmar la cuenta. Por favor, intenta nuevamente o contacta con soporte.';
      } else if (params['message'] === 'password_reset_success') {
        this.successMessage = 'Contraseña restablecida exitosamente. Ya puedes iniciar sesión.';
      }
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
