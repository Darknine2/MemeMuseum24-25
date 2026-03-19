import { Routes } from '@angular/router';
import { Homepage } from './pages/homepage/homepage';
import { LoginPage } from './pages/login/login';
import { RegisterPage } from './pages/register/register';
import { CreateMeme } from './pages/create-meme/create-meme';

export const routes: Routes = [
    { path: 'home', component: Homepage },
    { path: 'login', component: LoginPage },
    { path: 'register', component: RegisterPage },
    { path: 'create-meme', component: CreateMeme },
    { path: '', redirectTo: 'home', pathMatch: 'full' },
];
