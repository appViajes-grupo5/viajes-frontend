import { Component } from '@angular/core';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  templateUrl: './user-profile.html',
  styleUrls: ['./user-profile.css'],
})
export class UserProfile {
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
