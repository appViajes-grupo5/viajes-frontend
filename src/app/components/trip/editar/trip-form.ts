import { Component, inject, Input, OnInit } from '@angular/core';
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
  selector: 'app-edit-trip-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './trip-form.html',
  styles: [],
})
export class TripEditFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private tripService = inject(TripService);
  private router = inject(Router);
  private myTripsComponent = inject(TripMyListComponent);

  @Input() idTrip: any = null;

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

  ngOnInit(): void {
    this.tripService.getTripById(this.idTrip).subscribe({
      next: (tripToEdit) => {
        if (tripToEdit) {
          this.tripForm.patchValue({
            ...tripToEdit,
            start_date: this.formatDate(tripToEdit.start_date),
            end_date: this.formatDate(tripToEdit.end_date),
          });
        }
      },
      error: (err) => console.error('Error loading trip', err),
    });
  }

  onSubmit(): void {
    if (this.tripForm.valid) {
      const formValues = this.tripForm.value;
      delete formValues.image_url;

      this.tripService
        .updateTrip({ ...formValues, trip_id: this.idTrip })
        .subscribe({
          next: () => {
            const modal = document.getElementById('modalViaje');
            const modalInstance = bootstrap.Modal.getInstance(modal);
            modalInstance?.hide();
            this.limpiarModal();
          },
          error: (err) => console.error('Error updating trip', err),
        });
    }
  }

  limpiarModal() {
    this.myTripsComponent.cargarViajes();
  }

  private formatDate(date: string | Date): string {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }
}
