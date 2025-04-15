import { Component, input } from '@angular/core';

@Component({
  selector: 'gifs-item',
  imports: [],
  templateUrl: './gifs-item.component.html',
})
export class GifsItemComponent {
  imageUrl = input.required<string>();
}
