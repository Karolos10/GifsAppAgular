import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '@environments/environment';
import type { GiphyResponde } from '../interfaces/giphy.interface';
import { Gif } from '../interfaces/gisf.interface';
import { GifMapper } from '../mapper/gif.mapper';
import { map, Observable, tap } from 'rxjs';

@Injectable({providedIn: 'root'})
export class GifsService {

  private http = inject(HttpClient);

  trendingGifs = signal<Gif[]>([]);
  trendingGifsLoading = signal(true);
  searchHistory = signal<Record<string, Gif[]>>({});
  serachHistoryKeys = computed(() => Object.keys(this.searchHistory()));

  constructor() {
    this.loadTrendingGifs();
  }

  loadTrendingGifs() {

    this.http.get<GiphyResponde>(`${ environment.giphyUrl }gifs/trending`, {
      params: {
        api_key: environment.giphyApiKey,
        limit: '30',
      }
    }).subscribe((resp) => {
      //console.log({resp});
      const gifs = GifMapper.mapGiphyItemsToGifArray(resp.data);
      this.trendingGifs.set(gifs);
      this.trendingGifsLoading.set(false);
      console.log({gifs});
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
