import { Injectable, inject } from '@angular/core';
import { GlobalBackendService } from '../backend/global-backend-service/global-backend-service';

@Injectable({
  providedIn: 'root',
})
export class ImageService {

  private global = inject(GlobalBackendService);

  getPathBackend(path: string | undefined | null): string {
    return this.global.getPathBackend(path);
  }



}
