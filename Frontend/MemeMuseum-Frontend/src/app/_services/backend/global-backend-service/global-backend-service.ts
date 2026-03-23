import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GlobalBackendService {

  private readonly baseUrl = 'http://localhost:3000';

  public getPathBackend(path: string | undefined | null): string {
    if (!path) return '';
    if (path === 'logo.png') return 'logo.png';
    return `${this.baseUrl}/${path}`;
  }


}
