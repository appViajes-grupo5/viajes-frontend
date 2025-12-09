import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ForumTopic, ForumReply } from '../models/forum.interface';

@Injectable({
    providedIn: 'root'
})
export class ForumService {

    private apiUrl = 'http://localhost:4000/api/forum';

    constructor(private http: HttpClient) { }

    // Obtener todos los temas del foro
    getTopics(): Observable<ForumTopic[]> {
        return this.http.get<ForumTopic[]>(this.apiUrl);
    }

    // Obtener un tema específico con sus respuestas
    getTopicById(id: number): Observable<ForumTopic> {
        return this.http.get<ForumTopic>(`${this.apiUrl}/${id}`);
    }

    // Crear un nuevo tema
    createTopic(topic: { title: string; content: string; category?: string }): Observable<any> {
        return this.http.post(this.apiUrl, topic);
    }

    // Responder a un tema
    replyToTopic(topicId: number, text: string): Observable<ForumReply[]> {
        return this.http.post<ForumReply[]>(`${this.apiUrl}/${topicId}/reply`, { text });
    }
}
