import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ForumService } from '../../services/forum.service';
import { ForumTopic, ForumReply } from '../../models/forum.interface';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-foro-detail',
    standalone: true,
    imports: [CommonModule, RouterLink, FormsModule],
    templateUrl: './foro-detail.html',
    styleUrl: './foro-detail.css'
})
export class ForoDetailComponent implements OnInit {
    forumService = inject(ForumService);
    authService = inject(AuthService);
    route = inject(ActivatedRoute);
    router = inject(Router);

    topic = signal<ForumTopic | null>(null);
    isAuthenticated = signal<boolean>(false);
    loading = signal<boolean>(true);

    // Formulario de respuesta
    replyText = '';
    sendingReply = signal<boolean>(false);

    ngOnInit() {
        this.isAuthenticated.set(this.authService.isAuthenticated());

        const topicId = this.route.snapshot.paramMap.get('id');
        if (topicId) {
            this.loadTopic(+topicId);
        }
    }

    loadTopic(id: number) {
        this.loading.set(true);
        this.forumService.getTopicById(id).subscribe({
            next: (data) => {
                this.topic.set(data);
                this.loading.set(false);
            },
            error: (err) => {
                console.error('Error cargando tema', err);
                this.loading.set(false);
                alert('No se pudo cargar el tema');
                this.router.navigate(['/foro']);
            }
        });
    }

    sendReply() {
        if (!this.replyText.trim()) {
            alert('Por favor, escribe una respuesta');
            return;
        }

        const topicId = this.topic()?.topic_id;
        if (!topicId) return;

        this.sendingReply.set(true);
        this.forumService.replyToTopic(topicId, this.replyText).subscribe({
            next: (replies) => {
                console.log('Respuesta enviada');
                // Actualizar las respuestas del tema
                const currentTopic = this.topic();
                if (currentTopic) {
                    this.topic.set({ ...currentTopic, replies: replies });
                }
                this.replyText = '';
                this.sendingReply.set(false);
            },
            error: (err) => {
                console.error('Error enviando respuesta', err);
                alert('Error al enviar respuesta. Asegúrate de estar autenticado.');
                this.sendingReply.set(false);
            }
        });
    }

    getCurrentUserId(): number | null {
        const user = this.authService.getCurrentUser();
        return user?.id || null;
    }
}
