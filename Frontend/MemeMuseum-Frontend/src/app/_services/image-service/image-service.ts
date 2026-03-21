import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ImageService {

  private readonly baseUrl = 'http://localhost:3000';

  getPathBackend(path: string | undefined | null): string {
    if (!path) return '';
    return `${this.baseUrl}/${path}`;
  }



}
