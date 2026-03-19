import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthBackendService {
  private url = 'http://localhost:3000/auth';
  private http = inject(HttpClient);

  login(credentials: {username: string, password: string}): Observable<{token: string}> {
    return this.http.post<{token: string}>(`${this.url}/login`, credentials);
  }

  register(credentials: {username: string, password: string}): Observable<{token: string}> {
    return this.http.post<{token: string}>(`${this.url}/register`, credentials);
  }

  updateCredentials(payload: any): Observable<any> {
    return this.http.put(`${this.url}`, payload);
  }

  deleteAccount(): Observable<any> {
    return this.http.delete(this.url);
  }
}
