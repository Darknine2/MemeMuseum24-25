import { Component, EventEmitter, inject, Output, Input } from '@angular/core';
import { AuthBackendService } from '../../../_services/backend/auth-backend-service/auth-backend-service';
import { AuthService } from '../../../_services/auth-service/auth-service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-update-credentials-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './update-credentials-modal.html',
  styleUrl: './update-credentials-modal.scss',
})
export class UpdateCredentialsModal {

  @Input() type: 'username' | 'password' = 'username';
  @Output() close = new EventEmitter<void>();

  authBackend = inject(AuthBackendService);
  authService = inject(AuthService);
  fb = inject(FormBuilder);

  credForm: FormGroup;
  isUpdatingPassword = false;
  updateMessage = '';
  updateError = '';

  constructor() {
    this.credForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newUsername: [''],
      newPassword: ['', [Validators.minLength(4)]],
      confirmPassword: ['']
    });
  }

  onSubmit() {
    this.updateError = '';
    this.updateMessage = '';

    if (this.credForm.invalid) {
      if (this.credForm.get('currentPassword')?.invalid) {
        this.updateError = "La password attuale è obbligatoria per confermare le modifiche.";
      } else if (this.credForm.get('newPassword')?.invalid) {
        this.updateError = "La nuova password deve contenere almeno 4 caratteri.";
      }
      return;
    }

    const { currentPassword, newUsername, newPassword, confirmPassword } = this.credForm.value;

    if (this.type === 'username') {
      if (!newUsername) {
        this.updateError = "Devi specificare il nuovo username.";
        return;
      }
    } else {
      if (!newPassword) {
        this.updateError = "Devi specificare una nuova password.";
        return;
      }
      if (newPassword !== confirmPassword) {
        this.updateError = "La nuova password non combacia con la conferma.";
        return;
      }
    }

    this.isUpdatingPassword = true;

    let updateObservable;

    if (this.type === 'username') {
      updateObservable = this.authBackend.changeUsername({
        password: currentPassword,
        newUsername: newUsername!
      });
    } else {
      updateObservable = this.authBackend.changePassword({
        password: currentPassword,
        newPassword: newPassword!
      });
    }

    updateObservable.subscribe({
      next: (res: any) => {
        if (res.token) {
          this.authService.updateToken(res.token);
        }
        this.updateMessage = res.message || "Credenziali aggiornate con successo!";
        this.isUpdatingPassword = false;

        // Chiude il modale dopo 1.5 secondi per mostrare il messaggio
        setTimeout(() => {
          this.closeModal();
        }, 1500);
      },
      error: (err: any) => {
        this.updateError = err.error?.message || "Errore durante l'aggiornamento. Ricontrolla la tua password attuale.";
        this.isUpdatingPassword = false;
      }
    });
  }

  closeModal() {
    this.close.emit();
  }

}
