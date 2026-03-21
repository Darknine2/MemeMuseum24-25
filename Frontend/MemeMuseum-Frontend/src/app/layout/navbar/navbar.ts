import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../_services/auth-service/auth-service';
import { MemeBackendService } from '../../_services/backend/meme-backend-service/meme-backend-service';
import { Meme } from '../../_services/backend/meme-backend-service/meme.type';
import { FeedbackService } from '../../_services/feedback-service/feedback.service';
import { AuthBackendService } from '../../_services/backend/auth-backend-service/auth-backend-service';
import { ImageService } from '../../_services/image-service/image-service';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  authService = inject(AuthService);
  authBackendService = inject(AuthBackendService);
  memeService = inject(MemeBackendService);
  feedbackService = inject(FeedbackService);
  imageService = inject(ImageService);

  dailyMeme: Meme | null = null;
  profilePicture: string | null = null;

  constructor(private router: Router) { }


  ngOnInit() {
    this.getProfilePicture();
  }

  goToDailyMeme() {
    console.log('Meme del giorno');
    this.memeService.getDailyMeme().subscribe({
      next: (meme) => {
        this.router.navigate(['/meme', meme.id]);
      },
      error: (error) => {
        console.error(error);
      }
    });


  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/home']).then(() => {
      setTimeout(() => {
        this.feedbackService.show('Logout effettuato!', 'info');
      }, 50);
    });
  }

  getProfilePicture() {

    this.authBackendService.getUserInfo(this.authService.user()!).subscribe({
      next: (userInfo) => {
        this.profilePicture = userInfo.profile_picture;
      },
      error: (error) => {
        console.error(error);
      }
    });

  }



}
