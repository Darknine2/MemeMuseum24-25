import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MemeBackendService } from '../../_services/backend/meme-backend-service/meme-backend-service';

@Component({
  selector: 'app-create-meme',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './create-meme.html',
  styleUrl: './create-meme.scss',
})
export class CreateMeme {
  private memeService = inject(MemeBackendService);
  private router = inject(Router);

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
    if (!file || !file.type.startsWith('image/')) return;
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
    return !!this.title.trim() && !!this.selectedFile && !this.isSubmitting;
  }

  onSubmit() {
    if (!this.canSubmit()) return;

    this.isSubmitting = true;
    this.errorMessage = '';

    this.memeService.createMeme({
      title: this.title.trim(),
      description: this.description.trim(),
      image: this.selectedFile!,
      tags: this.tags
    }).subscribe({
      next: () => {
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Errore durante il caricamento del meme.';
        this.isSubmitting = false;
      }
    });
  }
}
