import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,

  // POR QUÉ: 'ReactiveFormsModule' es necesario
  // para que [formGroup] y formControlName funcionen.
  imports: [ReactiveFormsModule],

  templateUrl: './login.html',

  styleUrls: ['./login.css']
})
export class LoginComponent implements OnInit {

  // El '!' arregla el error de inicialización de TypeScript
  loginForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      loginEmail: ['', [Validators.required, Validators.email]],
      loginPassword: ['', [Validators.required]]
    });
  }

  // Getters para un HTML más limpio
  get email() { return this.loginForm.get('loginEmail'); }
  get password() { return this.loginForm.get('loginPassword'); }

  // Lógica de envío
  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    console.log('Formulario de Login VÁLIDO. Enviando datos...');
    console.log(this.loginForm.value);

    // Aquí llamarías a tu servicio de autenticación
  }
}
