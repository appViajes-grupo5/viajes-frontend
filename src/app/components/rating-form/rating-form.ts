import { Component, Input, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RatingsService, CreateRatingDto } from '../../services/ratings.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-rating-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './rating-form.html',
  styleUrl: './rating-form.css'
})
export class RatingFormComponent {

  @Input() tripId!: number;
  @Input() ratedUserId!: number;
  @Input() onRatingSubmitted?: () => void;

  ratingsService = inject(RatingsService);

  score = signal<number>(0);
  comment = signal<string>('');
  isSubmitting = signal<boolean>(false);
  isSuccess = signal<boolean>(false);

  setScore(value: number) {
    this.score.set(value);
  }

  onCommentChange(event: any) {
    this.comment.set(event.target.value);
  }

  submitRating() {
    if (!this.tripId || !this.ratedUserId || this.score() === 0) {
      alert('Por favor, selecciona una puntuación');
      return;
    }

    this.isSubmitting.set(true);
    this.isSuccess.set(false);

    const body: CreateRatingDto = {
      trip_id: this.tripId,
      rated_user_id: this.ratedUserId,
      rating_value: this.score(),
      comment: this.comment() || undefined
    };
    
    this.ratingsService.createRating(body).subscribe({
      next: () => {
        this.isSuccess.set(true);
        this.score.set(0);
        this.comment.set('');
        
        if (this.onRatingSubmitted) {
          this.onRatingSubmitted();
        }
        
        setTimeout(() => {
          this.isSubmitting.set(false);
          this.isSuccess.set(false);
        }, 2000);
      },
      error: (err) => {
        console.error('Error creando valoración', err);
        this.isSubmitting.set(false);
        this.isSuccess.set(false);
        const errorMsg = err.error?.error || 'Error al enviar la valoración';
        alert(errorMsg);
      }
    });
  }
}
