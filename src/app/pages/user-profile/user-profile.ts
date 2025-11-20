import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe, SlicePipe, Location } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, DatePipe, SlicePipe],
  templateUrl: './user-profile.html',
  styleUrls: ['./user-profile.css']
})
export class UserProfileComponent implements OnInit {
  profileForm!: FormGroup;
  defaultAvatarUrl = 'assets/images/profile-placeholder.jpg';
  avatarPreviewUrl: string | null = null; // Para vista previa temporal
  isLoading: boolean = false;
  isSaving: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private location: Location,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      // Campos editables según la BD: first_name, last_name, phone, bio, interests, profile_picture_url
      firstName: ['', [Validators.required, Validators.maxLength(100)]],
      lastName: ['', [Validators.maxLength(100)]],
      phone: ['', [Validators.maxLength(25)]],
      bio: ['', [Validators.maxLength(500)]],
      interests: [''],
      profilePictureUrl: [null],
      // Campos de solo lectura (no editables): email, average_rating, created_at
      email: ['', [Validators.required, Validators.email]],
      averageRating: [0],
      createdAt: [new Date()]
    });

    this.loadUserData();
  }

  loadUserData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.authService.getCurrentUserFromApi().subscribe({
      next: (userData) => {
        this.isLoading = false;
        
        // Cargar datos en el formulario
        this.profileForm.patchValue({
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          phone: userData.phone || '',
          bio: userData.bio || '',
          interests: userData.interests || '',
          profilePictureUrl: userData.profilePictureUrl || null,
          email: userData.email || '',
          averageRating: userData.averageRating || 0,
          createdAt: userData.createdAt ? new Date(userData.createdAt) : new Date()
        });

        // Actualizar vista previa de foto (si hay URL)
        if (userData.profilePictureUrl) {
          this.avatarPreviewUrl = userData.profilePictureUrl;
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error cargando usuario:', error);
        this.errorMessage = error.error?.error || 'Error al cargar los datos del usuario';
      }
    });
  }

  goBack(): void {
    this.location.back();
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formValue = this.profileForm.value;
    // Solo enviar campos editables: firstName, lastName, phone, bio, interests, profilePictureUrl
    // profilePictureUrl debe ser una URL, no base64
    const updateData = {
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      phone: formValue.phone || null,
      bio: formValue.bio || null,
      interests: formValue.interests || null,
      profilePictureUrl: formValue.profilePictureUrl || null // URL, no base64
    };

    this.authService.updateUser(updateData).subscribe({
      next: (response) => {
        this.isSaving = false;
        this.successMessage = 'Perfil actualizado con éxito';
        this.profileForm.markAsPristine();
        
        // Actualizar datos en el formulario con la respuesta
        this.profileForm.patchValue({
          firstName: response.firstName,
          lastName: response.lastName,
          phone: response.phone,
          bio: response.bio,
          interests: response.interests,
          profilePictureUrl: response.profilePictureUrl,
          email: response.email,
          averageRating: response.averageRating
        });

        // Ocultar mensaje después de 3 segundos
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (error) => {
        this.isSaving = false;
        console.error('Error actualizando usuario:', error);
        this.errorMessage = error.error?.error || 'Error al actualizar el perfil';
      }
    });
  }

  // Método para actualizar la vista previa cuando cambia la URL
  onUrlChange(): void {
    const url = this.profileForm.get('profilePictureUrl')?.value;
    if (url) {
      this.avatarPreviewUrl = url;
      this.profileForm.markAsDirty();
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
