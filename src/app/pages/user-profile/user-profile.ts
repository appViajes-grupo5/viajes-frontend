import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './user-profile.html',
  styleUrls: ['./user-profile.css'],
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
export class UserProfileComponent {
  // Datos de ejemplo; en producción llegan desde el backend
  user = {
    username: 'maria_g',
    name: 'María José',
    apellidos: 'García López',
    interests: ['Viajes', 'Fotografía', 'Gastronomía'],
    bio: 'Apasionada viajera y fotógrafa aficionada. Me encanta descubrir culturas y probar platos locales.',
    rating: 4,
    email: 'maria.josé_garcia@example.com',
    phone: '+34 612 987 654',
  };

  // URL por defecto y dato cargado desde input file
  // Foto por defecto (randomuser)
  defaultAvatarUrl = 'https://randomuser.me/api/portraits/women/44.jpg';
  avatarDataUrl: string | null = null;

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.avatarDataUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  // Volver en el historial; sencillo para evitar inyectar Location
  goBack(): void {
    try {
      window.history.back();
    } catch (e) {
  // fallback: ninguno
    }
  }


}
