import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './layout/navbar/navbar';
import { MemeCard } from './shared/components/meme-card/meme-card';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, MemeCard],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'MemeMuseum-Frontend';
}
