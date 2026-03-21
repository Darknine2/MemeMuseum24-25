import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Comment } from './comment.type';
import { GlobalBackendService } from '../global-backend-service/global-backend-service';

@Injectable({
  providedIn: 'root'
})
export class CommentBackendService {
  private global = inject(GlobalBackendService);
  private baseUrl = this.global.getPathBackend('meme');
  private http = inject(HttpClient);

  getCommentsByMeme(memeId: number) {
    return this.http.get<Comment[]>(`${this.baseUrl}/${memeId}/comment`);
  }

  createComment(memeId: number, text: string) {
    return this.http.post<Comment>(`${this.baseUrl}/${memeId}/comment`, { text });
  }

  deleteComment(memeId: number, commentId: number) {
    return this.http.delete(`${this.baseUrl}/${memeId}/comment/${commentId}`);
  }
}
