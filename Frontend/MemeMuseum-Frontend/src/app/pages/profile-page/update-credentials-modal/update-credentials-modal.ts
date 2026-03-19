import { Component, EventEmitter, inject, Output } from '@angular/core';
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

    if (!newUsername && !newPassword) {
      this.updateError = "Devi specificare almeno un nuovo campo da aggiornare.";
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      this.updateError = "La nuova password non combacia con la conferma.";
      return;
    }

    this.isUpdatingPassword = true;

    const payload = {
      password: currentPassword,
      newUsername: newUsername || undefined,
      newPassword: newPassword || undefined,
    };

    this.authBackend.updateCredentials(payload).subscribe({
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
