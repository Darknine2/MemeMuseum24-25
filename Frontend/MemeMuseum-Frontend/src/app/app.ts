import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from './layout/footer/footer';
import { Navbar } from './layout/navbar/navbar';
import { MemeCard } from './shared/components/meme-card/meme-card';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer, MemeCard],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'MemeMuseum-Frontend';
}
