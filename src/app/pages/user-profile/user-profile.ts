import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './user-profile.html',
  styleUrls: ['./user-profile.css']
})
export class UserProfileComponent implements OnInit {

  profileForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    // Inicializamos el formulario con datos "mock" (simulados)
    // En el futuro, estos vendrán de tu base de datos
    this.profileForm = this.fb.group({
      firstName: ['Laura', [Validators.required]],
      lastName: ['García', [Validators.required]],
      email: ['laura.garcia@email.com', [Validators.required, Validators.email]],
      interests: ['Me encanta el senderismo, probar comida local y visitar museos de historia.', [Validators.maxLength(500)]]
    });
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      // Aquí iría la lógica para enviar los datos al servidor
      console.log('Datos de perfil actualizados:', this.profileForm.value);

      // Opcional: Mostrar un mensaje de éxito (podríamos usar un Toast de Bootstrap más adelante)
      alert('¡Perfil actualizado con éxito!');

      // Marcamos el formulario como "pristine" (no modificado) de nuevo
      this.profileForm.markAsPristine();
    }
  }
}
