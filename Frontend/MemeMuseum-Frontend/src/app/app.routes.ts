import { Routes } from '@angular/router';
import { Homepage } from './pages/homepage/homepage';
import { LoginPage } from './pages/login/login';
import { RegisterPage } from './pages/register/register';
import { HandleMemeComponent } from './pages/handle-meme/handle-meme';
import { MemePage } from './pages/meme-page/meme-page';
import { ProfilePage } from './pages/profile-page/profile-page';
import { authGuard, authorGuard } from './_guards/auth.guard';

export const routes: Routes = [
    { path: 'home', component: Homepage },
    { path: 'login', component: LoginPage },
    { path: 'register', component: RegisterPage },
    { path: 'my-profile', component: ProfilePage, canActivate: [authGuard] },
    { path: 'profile/:username', component: ProfilePage },
    { path: 'create-meme', component: HandleMemeComponent, canActivate: [authGuard] },
    { path: 'update-meme/:id', component: HandleMemeComponent, canActivate: [authorGuard] },
    { path: 'meme/:id', component: MemePage },
    { path: '', redirectTo: 'home', pathMatch: 'full' },
];
