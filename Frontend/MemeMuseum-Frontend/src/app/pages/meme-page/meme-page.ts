import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MemeBackendService } from '../../_services/backend/meme-backend-service/meme-backend-service';
import { CommentBackendService } from '../../_services/backend/comment-backend-service/comment-backend-service';
import { AuthService } from '../../_services/auth-service/auth-service';
import { Meme } from '../../_services/backend/meme-backend-service/meme.type';
import { Comment } from '../../_services/backend/comment-backend-service/comment.type';
import { MemeCard } from '../../shared/meme-card/meme-card';
import { CommentCard } from '../../shared/comment-card/comment-card';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-meme-page',
  imports: [CommonModule, FormsModule, MemeCard, CommentCard, RouterLink],
  templateUrl: './meme-page.html',
  styleUrl: './meme-page.scss',
})
export class MemePage implements OnInit {
  private route = inject(ActivatedRoute);
  private memeService = inject(MemeBackendService);
  private commentService = inject(CommentBackendService);
  authService = inject(AuthService);

  meme: Meme | null = null;
  comments: Comment[] = [];
  newCommentText: string = '';
  isSubmittingComment: boolean = false;
  loadingMeme: boolean = true;
  errorMessage: string = '';

  ngOnInit() {
    //paramMap è un Observable che notifica quando i parametri cambiano
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (id) {
        this.loadingMeme = true;
        this.loadMeme(id);
        this.loadComments(id);
      }
    });
  }

  loadMeme(id: number) {
    this.memeService.getMemeById(id).subscribe({
      next: (meme: Meme) => {
        this.meme = meme;
        this.loadingMeme = false;
      },
      error: () => {
        this.errorMessage = 'Meme non trovato.';
        this.loadingMeme = false;
      }
    });
  }

  loadComments(id: number) {
    this.commentService.getCommentsByMeme(id).subscribe({
      next: (comments) => {
        this.comments = comments;
      }
    });
  }

  submitComment() {
    if (!this.newCommentText.trim() || !this.meme?.id) return;
    this.isSubmittingComment = true;
    this.meme.comment_count = (this.meme.comment_count || 0) + 1;

    this.commentService.createComment(this.meme.id, this.newCommentText.trim()).subscribe({
      next: (comment) => {
        // Aggiungo lo username corrente localmente per non fare un reload
        (comment as any).User = { username: this.authService.user() };
        this.comments.unshift(comment);
        this.newCommentText = '';
        this.isSubmittingComment = false;
      },
      error: () => {
        this.isSubmittingComment = false;
      }
    });
  }

  onCommentDeleted(commentId: number) {
    if (!this.meme?.id) return;
    this.commentService.deleteComment(this.meme.id, commentId).subscribe({
      next: () => {
        this.comments = this.comments.filter(c => c.id !== commentId);
      }
    });
  }
}
