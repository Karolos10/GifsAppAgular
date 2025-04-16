import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { environment } from '@environments/environment';
import type { GiphyResponde } from '../interfaces/giphy.interface';
import { Gif } from '../interfaces/gisf.interface';
import { GifMapper } from '../mapper/gif.mapper';
import { map, Observable, tap } from 'rxjs';

const GIF_KEY = 'gifsHistory';

const loadFromLocalStorage = () => {
  const gifsFromLocalStorage = localStorage.getItem(GIF_KEY) || '{}';
  const gifs = JSON.parse(gifsFromLocalStorage);

  return gifs;
}

@Injectable({providedIn: 'root'})
export class GifsService {

  private http = inject(HttpClient);

  trendingGifs = signal<Gif[]>([]);
  trendingGifsLoading = signal(false);
  private trendingPage = signal(0);

  trendingGifGroup = computed<Gif[][]>(() => {
    const groups = [];

    for(let i = 0; i < this.trendingGifs().length; i += 3){
      groups.push(this.trendingGifs().slice(i, i + 3));
    }

    return groups;
  })

  searchHistory = signal<Record<string, Gif[]>>(loadFromLocalStorage());
  serachHistoryKeys = computed(() => Object.keys(this.searchHistory()));

  constructor() {
    this.loadTrendingGifs();
  }

  saveGifsToLocalStorage = effect(() => {
    const historyString = JSON.stringify(this.searchHistory());
    localStorage.setItem(GIF_KEY, historyString);
  })

  loadTrendingGifs() {

    if(this.trendingGifsLoading()) return;

    this.trendingGifsLoading.set(true);

    this.http.get<GiphyResponde>(`${ environment.giphyUrl }gifs/trending`, {
      params: {
        api_key: environment.giphyApiKey,
        limit: '30',
        offset: this.trendingPage() * 30,
      }
    }).subscribe((resp) => {
      //console.log({resp});
      const gifs = GifMapper.mapGiphyItemsToGifArray(resp.data);
      this.trendingGifs.update(currentGifs => [
        ...currentGifs,
        ...gifs,
      ]);
      this.trendingPage.update((page) => page + 1);
      this.trendingGifsLoading.set(false);
      //console.log({gifs});
    })
  }

  searchGifs(query: string): Observable<Gif[]> {
    return this.http.get<GiphyResponde>(`${ environment.giphyUrl }gifs/search`, {
      params: {
        api_key: environment.giphyApiKey,
        limit: '30',
        q: query,
      }
    }).pipe(
      map(({data}) => data),
      map((items) => GifMapper.mapGiphyItemsToGifArray(items)),

      tap( items => {
        this.searchHistory.update((history) => ({
          ...history,
          [query.toLowerCase()]: items,
        }));
      })
    );
    // .subscribe((resp) => {
    //   //console.log({resp});
    //   const gifs = GifMapper.mapGiphyItemsToGifArray(resp.data);
    //   /* this.trendingGifs.set(gifs);
    //   this.trendingGifsLoading.set(false); */
    //   console.log({search: gifs});
    // })
  }

  getHistoryGifs(query: string): Gif[]{
    return this.searchHistory()[query] ?? [];
  }

}
