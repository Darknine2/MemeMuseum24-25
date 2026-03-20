import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthBackendService } from '../../_services/backend/auth-backend-service/auth-backend-service';
import { AuthService } from '../../_services/auth-service/auth-service';
import { FeedbackService } from '../../_services/feedback-service/feedback.service';

//AbstractControl è la classe astratta implementata da FormControl e FormGroup
export function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;
  return password === confirmPassword ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class RegisterPage {
  private fb = inject(FormBuilder);
  private authBackend = inject(AuthBackendService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private feedbackService = inject(FeedbackService);

  registerForm = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [
      Validators.required,
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,}$/)
    ]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: passwordMatchValidator });

  errorMessage: string = '';

  onSubmit() {
    if (this.registerForm.valid) {
      const { username, password } = this.registerForm.value;
      this.authBackend.register({ username, password } as any).subscribe({
        next: (res) => {
          this.authService.updateToken(res.token);
          this.feedbackService.show('Registrazione completata con successo!', 'success');
          this.router.navigate(['/']);
        },
        error: (err) => {
          if (err.status === 409) {
            this.registerForm.get('username')?.setErrors({ alreadyExists: true });
            this.feedbackService.show('Questo username è già in uso', 'error');
            this.errorMessage = 'Username non disponibile.';
          } else {
            const msg = err.error?.description || err.error?.error || 'Registrazione fallita. Riprova.';
            this.errorMessage = msg;
            this.feedbackService.show(msg, 'error');
          }
        }
      });
    }
  }
}
