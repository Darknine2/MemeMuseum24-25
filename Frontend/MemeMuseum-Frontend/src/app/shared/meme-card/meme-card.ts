import { Component, inject, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Meme } from '../../_services/backend/meme-backend-service/meme.type';
import { MemeBackendService } from '../../_services/backend/meme-backend-service/meme-backend-service';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../_services/auth-service/auth-service';
import { GlobalBackendService } from '../../_services/backend/global-backend-service/global-backend-service';
import { FeedbackService } from '../../_services/feedback-service/feedback.service';

type VoteType = 'up' | 'down' | null;

@Component({
  selector: 'app-meme-card',
  imports: [CommonModule, RouterLink],
  templateUrl: './meme-card.html',
  styleUrl: './meme-card.scss'
})
export class MemeCard implements OnInit, OnDestroy {
  @Input() meme: Meme | null = null;
  @Input() showDescription: boolean = false;
  @Input() isStandalone: boolean = false;

  memeService = inject(MemeBackendService);
  authService = inject(AuthService);
  router = inject(Router);
  globalBackendService = inject(GlobalBackendService);
  feedbackService = inject(FeedbackService);

  // Stato del modale di Login
  isAuthModalVisible: boolean = false;

  // Stato del voto corrente dell'utente per questo specifico meme
  currentVote: VoteType = null;

  // Utilizziamo un RxJS Subject per catturare i click ed emetterli nel tempo
  private voteSubject = new Subject<VoteType>();
  private voteSubscription!: Subscription;

  ngOnInit() {

    // Imposta il voto iniziale se l'utente ha già votato questo meme
    if (this.meme?.Votes && this.meme.Votes.length > 0) {
      const userVote = this.meme.Votes[0].vote;
      this.currentVote = userVote === true ? 'up' : 'down';
    }

    // Applichiamo un "Debounce": attenderà che l'utente stia fermo per 500 millisecondi 
    // prima di lasciar passare in uscita l'ultimo valore cliccato
    this.voteSubscription = this.voteSubject.pipe(
      debounceTime(500)
    ).subscribe((finalVote) => {
      this.sendVoteToBackend(finalVote);
    });
  }

  ngOnDestroy() {
    // Evitiamo memory leaks spegnendo la subscription quando la card viene distrutta
    if (this.voteSubscription) {
      this.voteSubscription.unsubscribe();
    }
  }

  onVote(type: 'up' | 'down') {
    if (!this.meme) return;

    if (!this.authService.isAuthenticated()) {
      this.isAuthModalVisible = true;
      return;
    }

    if (this.currentVote === type) {
      // Clicca lo stesso tasto: Annulla il voto
      if (type === 'up') this.meme.votes_count = (this.meme.votes_count || 0) - 1;
      if (type === 'down') this.meme.votes_count = (this.meme.votes_count || 0) + 1;
      this.currentVote = null;
    } else {
      // Cambio voto o nuovo voto
      if (this.currentVote === 'up' && type === 'down') {
        this.meme.votes_count = (this.meme.votes_count || 0) - 2;
      } else if (this.currentVote === 'down' && type === 'up') {
        this.meme.votes_count = (this.meme.votes_count || 0) + 2;
      } else if (!this.currentVote) { //voto nuovo
        if (type === 'up') this.meme.votes_count = (this.meme.votes_count || 0) + 1;
        if (type === 'down') this.meme.votes_count = (this.meme.votes_count || 0) - 1;
      }

      this.currentVote = type;
    }

    // Trasmettiamo il nuovo stato attuale dello user al Subject (che lo freezerà per il tempo prestabilito)
    this.voteSubject.next(this.currentVote);
  }

  sendVoteToBackend(voteState: VoteType) {
    if (!this.meme?.id) return;

    // TODO: Inviare la richiesta esatta con il MemeBackendService:
    if (voteState === null) {
      this.memeService.removeVoteMeme(this.meme.id).subscribe({
        next: () => {
          console.log('Voto rimosso con successo');
        },
        error: (error) => {
          console.error('Errore durante la rimozione del voto:', error);
        }
      });
    } else {
      console.log(voteState == 'up');
      this.memeService.voteMeme(this.meme.id, voteState == 'up').subscribe({
        next: () => {
          console.log('Voto inviato con successo');
        },
        error: (error) => {
          console.error('Errore durante l\'invio del voto:', error);
        }
      });
    }
    // this.memeService.voteMeme(this.meme.id, actionStr).subscribe(...)
  }

  closeAuthModal() {
    this.isAuthModalVisible = false;
  }

  goToLogin() {
    this.isAuthModalVisible = false;
    this.router.navigate(['/login']);
  }

  showOptions: boolean = false;
  showDeleteModal: boolean = false;

  toggleOptions(event: Event) {
    event.stopPropagation();
    event.preventDefault();
    this.showOptions = !this.showOptions;
  }

  navigateToUpdate(event: Event) {
    event.stopPropagation();
    event.preventDefault();
    this.router.navigate(['/update-meme', this.meme?.id]);
  }

  openDeleteModal(event: Event) {
    event.stopPropagation();
    event.preventDefault();
    this.showOptions = false;
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
  }

  confirmDelete() {
    if (!this.meme?.id) return;
    this.memeService.deleteMeme(this.meme.id).subscribe({
      next: () => {
        this.feedbackService.show('Meme eliminato con successo!', 'success');
        this.showDeleteModal = false;

        if (this.isStandalone) {
          this.router.navigate(['/home']);
        } else {
          const currentUrl = this.router.url;
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate([currentUrl]);
          });
        }
      },
      error: (e) => {
        this.feedbackService.show('Errore durante l\'eliminazione: ' + (e.error?.message || e.message), 'error');
        this.showDeleteModal = false;
      }
    });
  }
}

