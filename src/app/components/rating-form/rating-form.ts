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

  // esto llegará desde TripDetail cuando integremos el componente
  @Input() tripId!: number;
  @Input() ratedUserId!: number;

  ratingsService = inject(RatingsService);

  // signals que guardan los datos del formulario
  score = signal<number>(0);
  comment = signal<string>('');

  // cambiar puntuacion
  setScore(value: number) {
    this.score.set(value);
  }

  // Cambiar comentario
  onCommentChange(event: any) {
    this.comment.set(event.target.value);
  }

  // método para envia la valoración al backend
  submitRating() {
    if (!this.tripId || !this.ratedUserId || this.score() === 0) {
      console.warn('Formulario incompleto');
      return;
    }

    const body: CreateRatingDto = {
      trip_id: this.tripId,
      rated_user_id: this.ratedUserId,
      score: this.score(),
      comment: this.comment()
    };
    this.ratingsService.createRating(body).subscribe({
      next: () => {
        console.log('Valoración enviada');
        // reiniciar formulario
        this.score.set(0);
        this.comment.set('');
      },
      error: (err) => {
        console.error('Error creando valoración', err);
      }
    });
  }
}
