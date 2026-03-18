import { Component, inject, Input } from '@angular/core';
import { Meme } from '../../_services/backend/meme-backend-service/meme.type';
import { MemeBackendService } from '../../_services/backend/meme-backend-service/meme-backend-service';
import { MemeCard } from '../../shared/components/meme-card/meme-card';

@Component({
  selector: 'app-homepage',
  imports: [MemeCard],
  templateUrl: './homepage.html',
  styleUrl: './homepage.scss',
})
export class Homepage {

  memeService = inject(MemeBackendService);
  memeList: Meme[] = [];

  ngOnInit(): void {
    this.memeService.getAllMemes().subscribe((response: any) => {
      // Il backend ritorna un oggetto { totalItems, totalPages, currentPage, memes: [] }
      this.memeList = response.memes || [];
    });
  }

}
