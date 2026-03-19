import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../_services/auth-service/auth-service';
import { AuthBackendService } from '../../_services/backend/auth-backend-service/auth-backend-service';
import { MemeBackendService } from '../../_services/backend/meme-backend-service/meme-backend-service';
import { MemeCard } from '../../shared/meme-card/meme-card';
import { Meme } from '../../_services/backend/meme-backend-service/meme.type';
import { UpdateCredentialsModal } from './update-credentials-modal/update-credentials-modal';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule, FormsModule, MemeCard, UpdateCredentialsModal],
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.scss',
})
export class ProfilePage implements OnInit {
  authService = inject(AuthService);
  authBackend = inject(AuthBackendService);
  memeService = inject(MemeBackendService);
  router = inject(Router);

  myMemes: Meme[] = [];
  isLoadingMemes: boolean = false;

  showCredentialsModal: boolean = false;

  ngOnInit() {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadMyMemes();
  }

  loadMyMemes() {
    this.isLoadingMemes = true;
    this.memeService.getMyMemes().subscribe({
      next: (memes) => {
        this.myMemes = memes || [];
        this.isLoadingMemes = false;
      },
      error: (err) => {
        console.error("Errore caricamento meme:", err);
        this.isLoadingMemes = false;
      }
    });
  }

  openCredentialsModal() {
    this.showCredentialsModal = true;
  }

  closeCredentialsModal() {
    this.showCredentialsModal = false;
  }

  onDeleteAccount() {
    if (confirm("Sei sicuro di voler eliminare defintivamente il tuo account e tutti i tuoi post? L'azione è irreversibile.")) {
      this.authBackend.deleteAccount().subscribe({
        next: () => {
          this.authService.logout();
        },
        error: (err) => {
          alert("Impossibile eliminare l'account: " + (err.error?.message || err.message));
        }
      });
    }
  }
}
