import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TripCommentsService, TripComment } from '../../services/trip-comments.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-trip-comments',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './trip-comments.html',
  styleUrls: ['./trip-comments.css']
})
export class TripCommentsComponent implements OnInit {
  @Input() tripId!: number;
  @Input() isApproved!: boolean;

  private commentsService = inject(TripCommentsService);
  private authService = inject(AuthService);

  comments = signal<TripComment[]>([]);
  newComment = signal<string>('');
  isLoading = signal<boolean>(false);
  currentUserId: number | null = null;

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.currentUserId = user.id;
    }
    this.loadComments();
  }

  loadComments() {
    if (!this.tripId || !this.isApproved) return;
    
    this.isLoading.set(true);
    this.commentsService.getCommentsByTrip(this.tripId).subscribe({
      next: (data) => {
        this.comments.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error cargando comentarios', err);
        if (err.status === 403) {
          this.comments.set([]);
        }
        this.isLoading.set(false);
      }
    });
  }

  onSubmit() {
    if (!this.newComment().trim() || !this.isApproved) return;

    this.commentsService.createComment(this.tripId, this.newComment().trim()).subscribe({
      next: (comment) => {
        this.comments.update(comments => [...comments, comment]);
        this.newComment.set('');
      },
      error: (err) => {
        console.error('Error creando comentario', err);
        alert(err.error?.error || 'Error al crear comentario');
      }
    });
  }

  canEdit(comment: TripComment): boolean {
    return this.currentUserId === comment.user_id;
  }

  deleteComment(commentId: number) {
    if (!confirm('¿Estás seguro de eliminar este comentario?')) return;

    this.commentsService.deleteComment(commentId).subscribe({
      next: () => {
        this.comments.update(comments => comments.filter(c => c.comment_id !== commentId));
      },
      error: (err) => {
        console.error('Error eliminando comentario', err);
        alert(err.error?.error || 'Error al eliminar comentario');
      }
    });
  }
}

