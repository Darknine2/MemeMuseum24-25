import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../_services/auth-service/auth-service';
import { MemeBackendService } from '../_services/backend/meme-backend-service/meme-backend-service';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isUserAuthenticated()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};

export const authorGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const memeService = inject(MemeBackendService);

  if (!authService.isUserAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  const memeIdParam = route.paramMap.get('id');
  const memeId = memeIdParam ? parseInt(memeIdParam, 10) : 0;

  if (!memeId) {
    router.navigate(['/home']);
    return false;
  }

  return memeService.getMemeById(memeId).pipe(
    map(meme => {
      // Verifichiamo la proprietà con il logged-in user estraendolo da AuthService
      const isOwner = meme.Author?.username === authService.getUser();
      if (isOwner) {
        return true;
      }
      router.navigate(['/home']);
      return false;
    }),
    catchError(() => {
      router.navigate(['/home']);
      return of(false); // of() wrappa un normale boolean restituendoci un Observable di emergenza
    })
  );
};
