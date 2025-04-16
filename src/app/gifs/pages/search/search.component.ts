import { Component, inject } from '@angular/core';
import { GifsListComponent } from "../../components/gifs-list/gifs-list.component";
import { GifsService } from '../../services/gifs.service';

@Component({
  selector: 'app-search',
  imports: [GifsListComponent],
  templateUrl: './search.component.html',
})
export default class SearchComponent {

  gitService = inject(GifsService);

  onSearch(query: string) {
    this.gitService.searchGifs(query);
    //console.log({query});
  }
 }
