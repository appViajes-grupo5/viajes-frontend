import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ForumService } from '../../services/forum.service';
import { ForumTopic } from '../../models/forum.interface';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-foro',
    standalone: true,
    imports: [CommonModule, RouterLink, FormsModule],
    templateUrl: './foro.html',
    styleUrl: './foro.css'
})
export class ForoComponent implements OnInit {
    forumService = inject(ForumService);
    authService = inject(AuthService);

    topics = signal<ForumTopic[]>([]);
    isAuthenticated = signal<boolean>(false);

    // Formulario de nuevo tema
    newTopic = {
        title: '',
        content: '',
        category: 'General'
    };

    showForm = signal<boolean>(false);
    loading = signal<boolean>(true);

    ngOnInit() {
        this.loadTopics();
        this.isAuthenticated.set(this.authService.isAuthenticated());
    }

    loadTopics() {
        this.loading.set(true);
        this.forumService.getTopics().subscribe({
            next: (data) => {
                this.topics.set(data);
                this.loading.set(false);
            },
            error: (err) => {
                console.error('Error cargando temas del foro', err);
                this.loading.set(false);
            }
        });
    }

    toggleForm() {
        this.showForm.set(!this.showForm());
    }

    createTopic() {
        if (!this.newTopic.title || !this.newTopic.content) {
            alert('Por favor, completa todos los campos');
            return;
        }

        this.forumService.createTopic(this.newTopic).subscribe({
            next: (response) => {
                console.log('Tema creado:', response);
                this.newTopic = { title: '', content: '', category: 'General' };
                this.showForm.set(false);
                this.loadTopics(); // Recargar la lista
            },
            error: (err) => {
                console.error('Error creando tema', err);
                alert('Error al crear el tema. Asegúrate de estar autenticado.');
            }
        });
    }

    getCategoryClass(category: string): string {
        const categoryColors: { [key: string]: string } = {
            'General': 'bg-secondary text-white',
            'Consejos': 'bg-success text-white',
            'Destinos': 'bg-primary text-white',
            'Experiencias': 'bg-warning text-dark',
            'Preguntas': 'bg-info text-dark'
        };
        return categoryColors[category] || 'bg-secondary text-white';
    }
}
