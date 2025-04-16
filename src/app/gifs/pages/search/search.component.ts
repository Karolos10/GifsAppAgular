import { Component, inject, signal } from '@angular/core';
import { GifsListComponent } from "../../components/gifs-list/gifs-list.component";
import { GifsService } from '../../services/gifs.service';
import { Gif } from '../../interfaces/gisf.interface';

@Component({
  selector: 'app-search',
  imports: [GifsListComponent],
  templateUrl: './search.component.html',
})
export default class SearchComponent {

  gitService = inject(GifsService);
  gifs = signal<Gif[]>([]);

  onSearch(query: string) {
    this.gitService.searchGifs(query)
      .subscribe((resp) => {
        this.gifs.set(resp);
        //console.log({resp});
      })
    //console.log({query});
  }
 }
