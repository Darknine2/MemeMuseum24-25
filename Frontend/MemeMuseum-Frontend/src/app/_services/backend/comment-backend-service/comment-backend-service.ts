import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Comment } from './comment.type';

@Injectable({
  providedIn: 'root'
})
export class CommentBackendService {
  private baseUrl = 'http://localhost:3000/meme';
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
