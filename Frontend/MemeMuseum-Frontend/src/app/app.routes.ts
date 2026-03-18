import { Routes } from '@angular/router';
import { Homepage } from './pages/homepage/homepage';
import { LoginPage } from './pages/login/login';
import { RegisterPage } from './pages/register/register';

export const routes: Routes = [
    { path: 'home', component: Homepage },
    { path: 'login', component: LoginPage },
    { path: 'register', component: RegisterPage },
    { path: '', redirectTo: 'home', pathMatch: 'full' },
];
