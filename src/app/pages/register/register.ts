// PASO 1: Importar TODAS las herramientas para Reactive Forms
import { Component, OnInit } from '@angular/core';
// ReactiveFormsModule es necesario para que [formGroup] funcione
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';

// --- VALIDADOR PERSONALIZADO ---
// Esta es la "Forma Angular" de replicar tu lógica
// de 'validatePasswordConfirmation' de 'script.js'.
function passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
  // Obtenemos los valores de los dos campos
  const password = control.get('registerPassword')?.value;
  const confirmPassword = control.get('registerPasswordConfirm')?.value;

  // Si no coinciden, devolvemos un objeto de error
  if (password !== confirmPassword) {
    return { passwordsDoNotMatch: true };
  }

  // Si coinciden, devolvemos 'null' (que significa "sin error")
  return null;
}
// --- FIN DEL VALIDADOR ---


@Component({
  selector: 'app-register',
  standalone: true,
  // PASO 2: Importar ReactiveFormsModule en el componente
  // Esto le da a nuestro HTML el poder de usar [formGroup] y formControlName
  imports: [ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent implements OnInit {

  // PASO 3: Definir la propiedad para nuestro "modelo" de formulario
  // El '!' (operador de aserción definitiva) le dice a TypeScript:
  // "Confía en mí, esta propiedad no será nula, la inicializaré en ngOnInit".
  registerForm!: FormGroup;

  // Esta variable un valor inicial
  showPassword = false;

  // PASO 4: Inyectar el FormBuilder (un ayudante para crear formularios)
  constructor(private fb: FormBuilder) {}

  // PASO 5: Definir la estructura del formulario en ngOnInit
  ngOnInit(): void {
    // Usamos el 'FormBuilder' (fb) para crear un 'group'
    this.registerForm = this.fb.group({

      // 'registerName' es un control con valor inicial '' y validador 'required'
      registerName: ['', [Validators.required]],

      // Podemos encadenar validadores
      registerEmail: ['', [Validators.required, Validators.email]],

      registerPassword: ['', [Validators.required, Validators.minLength(6)]],

      registerPasswordConfirm: ['', [Validators.required]]

    }, {
      // PASO 6: Aplicar nuestro validador personalizado al GRUPO
      validators: passwordsMatchValidator
    });
  }

  // PASO 7: "Getters" de conveniencia
  // Para un acceso más fácil en el HTML (ej. 'name' en lugar de 'registerForm.get("registerName")')
  get name() { return this.registerForm.get('registerName'); }
  get email() { return this.registerForm.get('registerEmail'); }
  get password() { return this.registerForm.get('registerPassword'); }
  get passwordConfirm() { return this.registerForm.get('registerPasswordConfirm'); }

  // PASO 8: Lógica para el checkbox (reemplaza 'registerShowPassword' de script.js)
  toggleShowPassword(): void {
    this.showPassword = !this.showPassword;
  }

  // PASO 9: El método de envío (reemplaza el 'submit' event listener de script.js)
  onSubmit(): void {
    // Comprobamos si el formulario NO es válido
    if (this.registerForm.invalid) {
      // Si es inválido, "toca" todos los campos para mostrar los errores
      this.registerForm.markAllAsTouched();
      return; // No hacer nada más
    }

    // Si llegamos aquí, el formulario es VÁLIDO
    console.log('Formulario de Registro VÁLIDO. Enviando datos...');
    console.log(this.registerForm.value);

    // Aquí es donde llamarías a tu servicio de autenticación
  }
}
