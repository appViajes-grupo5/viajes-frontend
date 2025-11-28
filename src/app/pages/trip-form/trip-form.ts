import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TripService } from '../../services/trip';
import { Trip } from '../../models/trip.interface';

@Component({
  selector: 'app-trip-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './trip-form.html',
  styles: []
})
export class TripFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private tripService = inject(TripService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private location = inject(Location);

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
    image_url: ['https://picsum.photos/800/600']
  });

  isEditMode = false;
  tripId?: number;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.tripId = Number(id);
      this.tripService.getTripById(this.tripId).subscribe({
        next: (tripToEdit) => {
          if (tripToEdit) {
            this.tripForm.patchValue({
              ...tripToEdit,
              start_date: this.formatDate(tripToEdit.start_date),
              end_date: this.formatDate(tripToEdit.end_date)
            });
          }
        },
        error: (err) => console.error('Error loading trip', err)
      });
    }
  }

  onSubmit(): void {
    if (this.tripForm.valid) {
      const formValues = this.tripForm.value;

      if (this.isEditMode && this.tripId) {
        this.tripService.updateTrip({ ...formValues, trip_id: this.tripId }).subscribe({
          next: () => {
            this.router.navigate(['/viaje', this.tripId]);
          },
          error: (err) => console.error('Error updating trip', err)
        });
      } else {
        this.tripService.addTrip(formValues).subscribe({
          next: (response) => {
            // El backend devuelve { message: "...", trip_id: ... }
            const newId = response.trip_id;
            this.router.navigate(['/viaje', newId]);
          },
          error: (err) => console.error('Error creating trip', err)
        });
      }
    }
  }

  goBack() { this.location.back(); }

  private formatDate(date: string | Date): string {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }
}
