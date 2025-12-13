import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TripMyListComponent } from '../../../pages/my-trip-list/trip-list';
import { TripService } from '../../../services/trip.service';

declare var bootstrap: any;

@Component({
  selector: 'app-create-trip-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './trip-form.html',
  styles: [],
})
export class TripFormComponent {
  private fb = inject(FormBuilder);
  private tripService = inject(TripService);
  private myTripsComponent = inject(TripMyListComponent);

  tripForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(5)]],
    description: ['', Validators.required],
    destination: ['', Validators.required],
    start_date: ['', Validators.required],
    end_date: ['', Validators.required],
    estimated_cost: [0, [Validators.required, Validators.min(1)]],
    min_participants: [1, [Validators.required, Validators.min(1)]],
    transport_details: ['', Validators.required],
    itinerary: ['', Validators.required],
    image_url: ['https://picsum.photos/800/600'],
  });

  tripId?: number;

  onSubmit(): void {
    if (this.tripForm.valid) {
      const formValues = this.tripForm.value;
      delete formValues.image_url;

      this.tripService.createTrip(formValues).subscribe({
        next: (response) => {
          const modal = document.getElementById('modalViaje');
          const modalInstance = bootstrap.Modal.getInstance(modal);
          modalInstance?.hide();
          this.myTripsComponent.cargarViajes();
        },
        error: (err) => console.error('Error creating trip', err),
      });
    }
  }

  private formatDate(date: string | Date): string {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }
}
