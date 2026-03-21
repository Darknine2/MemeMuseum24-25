import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GlobalBackendService {

  private readonly baseUrl = 'http://localhost:3000';

  public getPathBackend(path: string | undefined | null): string {
    if (!path) return '';
    return `${this.baseUrl}/${path}`;
  }


}
