import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthBackendService } from '../../_services/backend/auth-backend-service/auth-backend-service';
import { AuthService } from '../../_services/auth-service/auth-service';

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

  registerForm = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(4)]]
  });

  errorMessage: string = '';

  onSubmit() {
    if (this.registerForm.valid) {
      this.authBackend.register(this.registerForm.value as any).subscribe({
        next: (res) => {
          this.authService.updateToken(res.token);
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.errorMessage = err.error?.error || 'Registrazione fallita. Riprova.';
        }
      });
    }
  }
}
