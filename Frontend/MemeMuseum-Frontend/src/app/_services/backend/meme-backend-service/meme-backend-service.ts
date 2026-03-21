import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Meme } from './meme.type';
import { MemeRequest } from './meme-request.type';
import { GlobalBackendService } from '../global-backend-service/global-backend-service';

@Injectable({
  providedIn: 'root',
})
export class MemeBackendService {
  url: string;
  constructor(private http: HttpClient, private global: GlobalBackendService) {
    this.url = this.global.getPathBackend('meme');
  }

  getAllMemes(page: number = 1, sortBy: string = '', filters: any = {}) {
    let url = `${this.url}?page=${page}`;
    if (sortBy) {
      url += `&sortBy=${sortBy}`;
    }

    if (filters.search) {
      url += `&search=${encodeURIComponent(filters.search)}`;
    }

    // tags is expected to be a string like "coding, funny"
    if (filters.tags) {
      const tagsArray = filters.tags.split(',').map((t: string) => t.trim()).filter((t: string) => t);
      tagsArray.forEach((tag: string) => {
        url += `&tags=${encodeURIComponent(tag)}`;
      });
    }

    if (filters.startDate) {
      url += `&startDate=${encodeURIComponent(filters.startDate)}`;
    }

    if (filters.endDate) {
      url += `&endDate=${encodeURIComponent(filters.endDate)}`;
    }

    return this.http.get<any>(url);
  }

  voteMeme(memeId: number, vote: boolean) {
    return this.http.post(`${this.url}/${memeId}/vote`, { vote });
  }

  removeVoteMeme(memeId: number) {
    return this.http.delete(`${this.url}/${memeId}/vote`);
  }

  createMeme(meme: MemeRequest) {
    const formData = new FormData();


    // Append the image file
    formData.append('image', meme.image);

    // The backend expects meme data as a JSON string under memeBody
    formData.append('memeBody', JSON.stringify({
      title: meme.title,
      description: meme.description
    }));

    // Append each tag to the array
    if (meme.tags && meme.tags.length > 0) {
      meme.tags.forEach(tag => {
        formData.append('tags', tag);
      });
    }

    return this.http.post(`${this.url}`, formData);
  }

  getMemeById(id: number) {
    return this.http.get<Meme>(`${this.url}/${id}`);
  }

  getDailyMeme() {
    return this.http.get<Meme>(`${this.url}/daily`);
  }

  getMyMemes(username: string, page: number = 1) {
    return this.http.get<any>(`${this.url}/user/${encodeURIComponent(username)}?page=${page}`);
  }

  deleteMeme(memeId: number) {
    return this.http.delete(`${this.url}/${memeId}`);
  }

  updateMeme(id: number, meme: MemeRequest) {
    const formData = new FormData();
    if (meme.image) {
      formData.append('image', meme.image);
    }
    formData.append('memeBody', JSON.stringify({
      title: meme.title,
      description: meme.description
    }));
    if (meme.tags && meme.tags.length > 0) {
      meme.tags.forEach(tag => {
        formData.append('tags', tag);
      });
    }
    return this.http.put(`${this.url}/${id}`, formData);
  }
}
