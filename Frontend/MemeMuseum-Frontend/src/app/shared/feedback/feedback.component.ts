import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeedbackService } from '../../_services/feedback-service/feedback.service';

@Component({
  selector: 'app-feedback',
  imports: [CommonModule],
  template: `
    @if (feedbackService.feedback(); as f) {
      <div class="feedback-container">
        <div class="feedback" [ngClass]="f.type">
          {{ f.message }}
        </div>
      </div>
    }
  `,
  styles: [`
    .feedback-container {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 9999;
      animation: slideIn 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    }
    .feedback {
      padding: 16px 24px;
      border-radius: 12px;
      color: white;
      font-weight: 600;
      font-size: 1rem;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .success { background: linear-gradient(135deg, #10b981, #059669); }
    .error { background: linear-gradient(135deg, #ef4444, #dc2626); }
    .info { background: linear-gradient(135deg, #3b82f6, #2563eb); }
    @keyframes slideIn {
      from { transform: translateX(120%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `]
})
export class FeedbackComponent {
  feedbackService = inject(FeedbackService);
}
