import { Component, inject, OnInit, HostListener } from '@angular/core';
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
  totalUserMemes: number = 0;
  isLoadingMemes: boolean = false;
  currentPage: number = 1;
  totalPages: number = 1;

  showCredentialsModal: boolean = false;
  showDeleteModal: boolean = false;
  modalType: 'username' | 'password' = 'username';

  ngOnInit() {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadMyMemes(1, true);
  }

  loadMyMemes(page: number, resetList: boolean = false) {
    if (this.isLoadingMemes) return;
    this.isLoadingMemes = true;

    this.memeService.getMyMemes(page).subscribe({
      next: (response: any) => {
        const newMemes = response.memes || [];
        
        if (resetList) {
          this.myMemes = newMemes;
        } else {
          this.myMemes = [...this.myMemes, ...newMemes];
        }
        
        this.currentPage = response.currentPage || page;
        this.totalPages = response.totalPages || 1;
        this.totalUserMemes = response.totalItems || this.myMemes.length;
        this.isLoadingMemes = false;
      },
      error: (err) => {
        console.error("Errore caricamento meme:", err);
        this.isLoadingMemes = false;
      }
    });
  }

  // Listener sullo scroll della pagina per la paginazione infinita
  @HostListener('window:scroll', [])
  onScroll(): void {
    if (this.isLoadingMemes || this.currentPage >= this.totalPages) {
      return;
    }
    
    const scrollPosition = (document.documentElement.scrollTop || document.body.scrollTop) + document.documentElement.clientHeight;
    const documentHeight = document.documentElement.scrollHeight;
    
    if(scrollPosition >= documentHeight - 100) {
      this.loadMyMemes(this.currentPage + 1);
    }
  }

  openCredentialsModal(type: 'username' | 'password') {
    this.modalType = type;
    this.showCredentialsModal = true;
  }

  closeCredentialsModal() {
    this.showCredentialsModal = false;
  }

  openDeleteModal() {
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
  }

  confirmDeleteAccount() {
    this.authBackend.deleteAccount().subscribe({
      next: () => {
        this.authService.logout();
        this.router.navigate(['/home']);
      },
      error: (err) => {
        alert("Impossibile eliminare l'account: " + (err.error?.message || err.message));
      }
    });
  }
}
