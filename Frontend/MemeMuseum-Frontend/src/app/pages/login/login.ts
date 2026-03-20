import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthBackendService } from '../../_services/backend/auth-backend-service/auth-backend-service';
import { AuthService } from '../../_services/auth-service/auth-service';
import { FeedbackService } from '../../_services/feedback-service/feedback.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginPage {
  private fb = inject(FormBuilder);
  private authBackend = inject(AuthBackendService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private feedbackService = inject(FeedbackService);

  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  errorMessage: string = '';

  onSubmit() {
    if (this.loginForm.valid) {
      this.authBackend.login(this.loginForm.value as any).subscribe({
        next: (res) => {
          this.authService.updateToken(res.token);
          this.feedbackService.show('Login effettuato con successo!', 'success');
          this.router.navigate(['/']);
        },
        error: (err) => {
          if (err.status === 401) {
            this.errorMessage = 'Username o password errati.';
          } else {
            this.errorMessage = err.error?.error || 'Login fallito. Riprova.';
          }
          this.feedbackService.show(this.errorMessage, 'error');
        }
      });
    }
  }
}
