import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe, SlicePipe, Location } from '@angular/common';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, DatePipe, SlicePipe],
  templateUrl: './user-profile.html',
  styleUrls: ['./user-profile.css']
})
export class UserProfileComponent implements OnInit {

  // Usamos '!' para indicar que se inicializará en ngOnInit
  profileForm!: FormGroup;

  // Variables para la gestión de la imagen de perfil
  defaultAvatarUrl = 'assets/images/profile-placeholder.jpg';
  avatarDataUrl: string | null = null;

  constructor(
    private fb: FormBuilder,
    private location: Location
  ) {}

  ngOnInit(): void {
    // Inicializamos el formulario mapeando la tabla 'users'
    this.profileForm = this.fb.group({
      // Campos editables
      firstName: ['', [Validators.required, Validators.maxLength(100)]], // varchar(100)
      lastName: ['', [Validators.maxLength(100)]],                       // varchar(100)
      email: ['', [Validators.required, Validators.email]],               // varchar(255) - readonly
      bio: ['', [Validators.maxLength(500)]],                             // text
      interests: [''],                                                    // text

      // Campos de solo lectura (para mostrar en la UI)
      profilePictureUrl: [null],                                          // varchar(255)
      averageRating: [0],                                                 // decimal(3,2)
      createdAt: [new Date()]                                             // timestamp
    });

    this.loadUserData();
  }

  loadUserData() {
    // SIMULACIÓN: Datos que vendrían de un SELECT * FROM users WHERE user_id = X
    const mockUserData = {
      firstName: 'Carlos',
      lastName: 'Fernández',
      email: 'carlos.viajero@example.com',
      bio: 'Me apasiona la fotografía de paisajes y descubrir la gastronomía local de cada pueblo.',
      interests: 'Senderismo, Fotografía, Cocina Italiana',
      averageRating: 4.9,
      createdAt: new Date('2024-02-10'),
      profilePictureUrl: 'https://i.pravatar.cc/150?img=11' // Ejemplo de URL
    };

    // Cargamos los datos en el formulario
    this.profileForm.patchValue(mockUserData);

    // Actualizamos la vista previa de la foto si existe
    if (mockUserData.profilePictureUrl) {
        this.avatarDataUrl = mockUserData.profilePictureUrl;
    }
  }

  goBack(): void {
    this.location.back();
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      // Aquí enviarías el objeto 'this.profileForm.value' a tu API
      // para hacer el UPDATE en la base de datos.
      console.log('Datos listos para UPDATE en BD:', this.profileForm.value);

      // Marcamos el formulario como "no modificado" tras guardar
      this.profileForm.markAsPristine();
      alert('Perfil actualizado con éxito'); // Feedback simple
    } else {
        // Si hay errores, marcamos los campos para mostrar mensajes
        this.profileForm.markAllAsTouched();
    }
  }

  // Método para previsualizar imagen seleccionada (sin subirla todavía)
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.avatarDataUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
}
