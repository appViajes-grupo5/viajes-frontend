import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, SlicePipe } from '@angular/common'; // Importar SlicePipe y CommonModule

@Component({
  selector: 'app-user-profile',
  standalone: true,
  // Importamos ReactiveFormsModule para [formGroup]
  // Importamos CommonModule para poder usar @if, [class], etc.
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './user-profile.html',
  styleUrls: ['./user-profile.css'],
})
export class UserProfileComponent implements OnInit {

  // Usamos '!' para asegurar a TypeScript que lo inicializaremos
  profileForm!: FormGroup;

  // Inyectamos el FormBuilder (fb) para crear el formulario
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    // Creamos el formulario reactivo
    this.profileForm = this.fb.group({
      // Mapeamos los campos de la base de datos a controles

      // CAMPO: first_name
      firstName: ['Laura', [Validators.required, Validators.maxLength(100)]],

      // CAMPO: last_name
      lastName: ['García', [Validators.required, Validators.maxLength(100)]],

      // CAMPO: email
      email: ['laura.garcia@email.com', [Validators.required, Validators.email, Validators.maxLength(255)]],

      // CAMPO: bio
      bio: ['Me encanta el senderismo, probar comida local y visitar museos de historia.', [Validators.maxLength(5000)]], // 5000 es un límite de ejemplo para 'text'

      // CAMPO: interests
      interests: ['Senderismo, Gastronomía, Museos', [Validators.maxLength(5000)]]

      // NOTA: profile_picture_url se manejaría por separado con un servicio de subida de archivos.
      // NOTA: password_hash NO se edita aquí.
    });

    // En un futuro real, aquí harías una llamada API
    // this.userService.getProfile().subscribe(data => {
    //   this.profileForm.patchValue(data);
    // });
  }

  // Método que se llama al enviar el formulario
  onSubmit(): void {
    // Comprobamos si el formulario es válido
    if (this.profileForm.valid) {

      console.log('Datos del perfil para guardar:', this.profileForm.value);

      // Aquí es donde llamarías a tu API para guardar los datos
      // this.userService.updateProfile(this.profileForm.value).subscribe(...)

      // Mostramos una alerta simple (idealmente sería un "toast")
      alert('¡Perfil actualizado con éxito!');

      // Marcamos el formulario como "pristine" (no modificado)
      // para que el botón "Guardar" se deshabilite de nuevo.
      this.profileForm.markAsPristine();
    } else {
      // Si el formulario no es válido (ej. email incorrecto), marcamos todos los campos
      // como "tocados" para que se muestren todos los mensajes de error.
      this.profileForm.markAllAsTouched();
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
