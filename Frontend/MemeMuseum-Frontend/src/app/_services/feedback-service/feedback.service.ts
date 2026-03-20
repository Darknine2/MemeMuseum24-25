import { Injectable, signal } from '@angular/core';

export interface FeedbackMessage {
  message: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({ providedIn: 'root' })
export class FeedbackService {
  feedback = signal<FeedbackMessage | null>(null);

  show(message: string, type: 'success' | 'error' | 'info' = 'info') {
    this.feedback.set({ message, type });
    setTimeout(() => {
      this.feedback.set(null);
    }, 3000);
  }
}
