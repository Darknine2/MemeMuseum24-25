import { Component, inject, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Meme } from '../../_services/backend/meme-backend-service/meme.type';
import { MemeBackendService } from '../../_services/backend/meme-backend-service/meme-backend-service';
import { MemeCard } from '../../shared/meme-card/meme-card';
import { TagField } from '../../shared/tag-field/tag-field';

@Component({
  selector: 'app-homepage',
  imports: [CommonModule, FormsModule, MemeCard, TagField],
  templateUrl: './homepage.html',
  styleUrl: './homepage.scss',
})
export class Homepage implements OnInit {

  memeService = inject(MemeBackendService);
  memeList: Meme[] = [];

  currentPage: number = 1;
  totalPages: number = 1;
  isLoading: boolean = false;
  currentSort: string = ''; // Vuoto = default (più recenti)

  // State per i filtri
  showFilters: boolean = false;
  searchQuery: string = '';
  filters = {
    tags: [] as string[],
    startDate: '',
    endDate: ''
  };

  ngOnInit(): void {
    this.loadMemes(this.currentPage, true);
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  applySearch() {
    this.currentPage = 1;
    this.loadMemes(1, true);
  }

  applyFilters() {
    this.currentPage = 1;
    this.loadMemes(1, true);
  }

  resetFilters() {
    this.filters = { tags: [], startDate: '', endDate: '' };
    this.searchQuery = '';
    this.applyFilters();
  }

  loadMemes(page: number, resetList: boolean = false) {
    if (this.isLoading) return;
    this.isLoading = true;

    // Unisco i filtri con la ricerca text-based
    const allFilters = { ...this.filters, search: this.searchQuery };

    this.memeService.getAllMemes(page, this.currentSort, allFilters).subscribe({
      next: (response: any) => {
        const newMemes = response.memes || [];

        if (resetList) {
          this.memeList = newMemes;
        } else {
          this.memeList = [...this.memeList, ...newMemes];
        }

        this.currentPage = response.currentPage || page;
        this.totalPages = response.totalPages || 1;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  onSortChange(sortType: string) {
    if (this.currentSort === sortType) return;
    this.currentSort = sortType;
    this.currentPage = 1;
    this.loadMemes(1, true); // Reset list
  }

  // Listener sullo scroll della pagina
  @HostListener('window:scroll', []) // Quando l'utente scrolla, viene chiamata la funzione onScroll
  onScroll(): void {
    if (this.isLoading || this.currentPage >= this.totalPages) {
      return;
    }

    const scrollPosition = (document.documentElement.scrollTop || document.body.scrollTop) + document.documentElement.clientHeight;
    const documentHeight = document.documentElement.scrollHeight;

    if (scrollPosition >= documentHeight - 100) {
      this.loadMemes(this.currentPage + 1);
    }
  }
}


