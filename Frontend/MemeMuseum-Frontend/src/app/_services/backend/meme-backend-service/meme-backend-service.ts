import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Meme } from './meme.type';

@Injectable({
  providedIn: 'root',
})
export class MemeBackendService {
  url: string = 'http://localhost:3000/meme';
  constructor(private http: HttpClient) { }

  getAllMemes() {

    return this.http.get<Meme[]>(this.url);
  }

  voteMeme(memeId: number, voteValue: boolean) {
    return this.http.post(`${this.url}/${memeId}/vote`, { voteValue });
  }

  removeVoteMeme(memeId: number) {
    return this.http.delete(`${this.url}/${memeId}/vote`);
  }

}
