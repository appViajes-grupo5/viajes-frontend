import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

function passwordsMatchValidator(
  control: AbstractControl
): ValidationErrors | null {
  const password = control.get('registerPassword')?.value;
  const confirmPassword = control.get('registerPasswordConfirm')?.value;

  if (password !== confirmPassword) {
    return { passwordsDoNotMatch: true };
  }

  return null;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;

  showPassword = false;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group(
      {
        registerName: ['', [Validators.required]],

        registerEmail: ['', [Validators.required, Validators.email]],

        registerPassword: ['', [Validators.required, Validators.minLength(6)]],

        registerPasswordConfirm: ['', [Validators.required]],
      },
      {
        validators: passwordsMatchValidator,
      }
    );
  }

  get name() {
    return this.registerForm.get('registerName');
  }
  get email() {
    return this.registerForm.get('registerEmail');
  }
  get password() {
    return this.registerForm.get('registerPassword');
  }
  get passwordConfirm() {
    return this.registerForm.get('registerPasswordConfirm');
  }

  toggleShowPassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.errorMessage = '';
    this.isLoading = true;

    const formValue = this.registerForm.value;
    const nameParts = formValue.registerName.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || undefined;

    this.authService
      .register(
        formValue.registerEmail,
        formValue.registerPassword,
        firstName,
        lastName
      )
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          console.log('Registro exitoso:', response);
          this.router.navigate(['/viajes']);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error en registro:', error);
          this.errorMessage =
            error.error?.error ||
            'Error al registrar usuario. Por favor, intenta de nuevo.';
        },
      });
  }
}
