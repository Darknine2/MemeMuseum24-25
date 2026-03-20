import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MemeBackendService } from '../../_services/backend/meme-backend-service/meme-backend-service';
import { MemeRequest } from '../../_services/backend/meme-backend-service/meme-request.type';
import { FeedbackService } from '../../_services/feedback-service/feedback.service';

@Component({
  selector: 'app-create-meme',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './create-meme.html',
  styleUrl: './create-meme.scss',
})
export class CreateMeme {
  private memeService = inject(MemeBackendService);
  private router = inject(Router);
  private feedbackService = inject(FeedbackService);

  // Form fields
  title: string = '';
  description: string = '';
  tagInput: string = '';
  tags: string[] = [];
  selectedFile: File | null = null;
  imagePreviewUrl: string | null = null;

  // UI state
  isSubmitting: boolean = false;
  errorMessage: string = '';

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    if (!file.type.startsWith('image/')) {
      this.errorMessage = 'Formato file non supportato. Inserisci un\'immagine.';
      this.selectedFile = null;
      this.imagePreviewUrl = null;
      return;
    }

    this.errorMessage = '';
    this.selectedFile = file;

    // Generate the local preview URL
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreviewUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer?.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.errorMessage = 'Formato file non supportato. Inserisci un\'immagine.';
      this.selectedFile = null;
      this.imagePreviewUrl = null;
      return;
    }

    this.errorMessage = '';
    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreviewUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  removeImage() {
    this.selectedFile = null;
    this.imagePreviewUrl = null;
  }

  addTag() {
    const tag = this.tagInput.trim().toLowerCase();
    if (!tag || this.tags.includes(tag) || this.tags.length >= 5) return;
    this.tags.push(tag);
    this.tagInput = '';
  }

  onTagKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      this.addTag();
    }
  }

  removeTag(tag: string) {
    this.tags = this.tags.filter(t => t !== tag);
  }

  canSubmit(): boolean {
    return this.title.trim().length > 0 && this.selectedFile !== null && !this.isSubmitting;
  }

  onSubmit() {
    if (!this.canSubmit()) return;

    this.isSubmitting = true;
    this.errorMessage = '';

    const memeRequest: MemeRequest = {
      title: this.title.trim(),
      description: this.description.trim(),
      image: this.selectedFile!,
      tags: this.tags
    }

    this.memeService.createMeme(memeRequest).subscribe({
      next: () => {
        this.feedbackService.show('Meme caricato con successo!', 'success');
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Errore durante il caricamento del meme.';
        this.isSubmitting = false;
      }
    });
  }
}
