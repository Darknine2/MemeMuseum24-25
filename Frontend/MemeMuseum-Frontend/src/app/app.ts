import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './layout/navbar/navbar';
import { MemeCard } from './shared/meme-card/meme-card';
import { FeedbackComponent } from './shared/feedback/feedback.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, MemeCard, FeedbackComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'MemeMuseum-Frontend';
}
