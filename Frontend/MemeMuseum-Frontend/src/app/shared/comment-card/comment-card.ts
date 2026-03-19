import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Comment } from '../../_services/backend/comment-backend-service/comment.type';
import { AuthService } from '../../_services/auth-service/auth-service';

@Component({
  selector: 'app-comment-card',
  imports: [CommonModule],
  templateUrl: './comment-card.html',
  styleUrl: './comment-card.scss',
})
export class CommentCard {
  @Input() comment!: Comment;
  @Input() memeId!: number;
  @Output() deleted = new EventEmitter<number>();

  authService = inject(AuthService);

  get isOwner(): boolean {
    return this.authService.user() === this.comment.userId;
  }

  onDelete() {
    if (this.comment.id) {
      this.deleted.emit(this.comment.id);
    }
  }
}
