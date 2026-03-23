import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { MemeBackendService } from '../../_services/backend/meme-backend-service/meme-backend-service';
import { MemeRequest } from '../../_services/backend/meme-backend-service/meme-request.type';
import { FeedbackService } from '../../_services/feedback-service/feedback.service';
import { TagField } from '../../shared/tag-field/tag-field';
import { GlobalBackendService } from '../../_services/backend/global-backend-service/global-backend-service';

@Component({
  selector: 'app-handle-meme',
  imports: [CommonModule, FormsModule, RouterLink, TagField],
  templateUrl: './handle-meme.html',
  styleUrl: './handle-meme.scss',
})
export class HandleMemeComponent implements OnInit {
  private memeService = inject(MemeBackendService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private feedbackService = inject(FeedbackService);
  private globalBackendService = inject(GlobalBackendService);

  // Form fields
  title: string = '';
  description: string = '';
  tagInput: string = '';
  tags: string[] = [];
  selectedFile: File | null = null;
  imagePreviewUrl: string | null = null;

  // Edit Mode state
  isEditMode: boolean = false;
  editMemeId: number | null = null;

  // UI state
  isSubmitting: boolean = false;
  errorMessage: string = '';

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.editMemeId = parseInt(idParam, 10);

      this.memeService.getMemeById(this.editMemeId).subscribe({
        next: (meme) => {
          this.title = meme.title;
          this.description = meme.description || '';
          this.tags = meme.Tags?.map(t => t.name) || [];
          this.imagePreviewUrl = this.globalBackendService.getPathBackend(meme.image_path);
        },
        error: () => {
          this.feedbackService.show("Impossibile caricare il meme da modificare", "error");
          this.router.navigate(['/home']);
        }
      });
    }
  }

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

    // Quando il file viene letto, imposta l'anteprima
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

  canSubmit(): boolean {
    if (this.isEditMode) {
      return this.title.trim().length > 0 && !this.isSubmitting;
    }
    return this.title.trim().length > 0 && this.selectedFile !== null && !this.isSubmitting;
  }

  onSubmit() {
    if (!this.canSubmit()) return;

    this.isSubmitting = true;
    this.errorMessage = '';

    const memeRequest: MemeRequest = {
      title: this.title.trim(),
      description: this.description.trim(),
      image: this.selectedFile as any,
      tags: this.tags
    }

    if (this.isEditMode && this.editMemeId) {
      this.memeService.updateMeme(this.editMemeId, memeRequest).subscribe({
        next: () => {
          this.feedbackService.show('Meme aggiornato con successo!', 'success');
          this.router.navigate(['/meme', this.editMemeId]);
        },
        error: (err) => {
          this.errorMessage = err?.error?.message || 'Errore durante l\'aggiornamento del meme.';
          this.isSubmitting = false;
        }
      });
    } else {
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
}
