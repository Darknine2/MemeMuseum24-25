import { Injectable, WritableSignal, computed, effect, signal } from '@angular/core';
import { jwtDecode } from "jwt-decode";
import { AuthState } from './auth-state.type';

// Service to manage the authentication state of the user

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authState: WritableSignal<AuthState> = signal<AuthState>({
    username: this.getUser(),
    token: this.getToken(),
    isAuthenticated: this.verifyToken(this.getToken())
  })

  user = computed(() => this.authState().username);
  token = computed(() => this.authState().token);
  isAuthenticated = computed(() => this.authState().isAuthenticated);


  constructor() {
    effect(() => {
      const token = this.authState().token;
      const user = this.authState().username;
      if (token !== null) {
        localStorage.setItem("token", token);
      } else {
        localStorage.removeItem("token");
      }
      if (user !== null) {
        localStorage.setItem("username", user);
      } else {
        localStorage.removeItem("username");
      }
    });
  }

  updateToken(token: string): void {
    const decodedToken: any = jwtDecode(token);
    const user = decodedToken.user;
    this.authState.set({
      username: user,
      token: token,
      isAuthenticated: this.verifyToken(token)
    })
  }

  getToken() {
    return localStorage.getItem("token");
  }

  getUser() {
    return localStorage.getItem("username");
  }

  verifyToken(token: string | null): boolean {
    if (token !== null) {
      try {
        const decodedToken = jwtDecode(token);
        const expiration = decodedToken.exp;
        if (expiration === undefined || Date.now() >= expiration * 1000) {
          return false; // scadenza non disponibile o passata
        } else {
          return true; //token non scaduto
        }
      } catch (error) { // token non valido
        return false;
      }
    }
    return false;
  }

  isUserAuthenticated(): boolean {
    return this.verifyToken(this.getToken());
  }

  logout() {
    this.authState.set({
      username: null,
      token: null,
      isAuthenticated: false
    })
  }




}
