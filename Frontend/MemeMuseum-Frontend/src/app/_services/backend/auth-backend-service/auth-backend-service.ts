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

  changeUsername(payload: {password: string, newUsername: string}): Observable<any> {
    return this.http.put(`${this.url}/username`, payload);
  }

  changePassword(payload: {password: string, newPassword: string}): Observable<any> {
    return this.http.put(`${this.url}/password`, payload);
  }

  deleteAccount(): Observable<any> {
    return this.http.delete(this.url);
  }

  updateProfilePicture(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('profilePicture', file);
    return this.http.put(`${this.url}/profile-picture`, formData);
  }

  getUserInfo(username: string): Observable<any> {
    return this.http.get(`${this.url}/${username}`);
  }
}
