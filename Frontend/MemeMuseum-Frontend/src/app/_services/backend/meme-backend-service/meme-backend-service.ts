import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Meme } from './meme.type';
import { MemeRequest } from './meme-request.type';

@Injectable({
  providedIn: 'root',
})
export class MemeBackendService {
  url: string = 'http://localhost:3000/meme';
  constructor(private http: HttpClient) { }

  getAllMemes() {

    return this.http.get<Meme[]>(this.url);
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

}
