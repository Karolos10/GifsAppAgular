import { Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { GifsListComponent } from "../../components/gifs-list/gifs-list.component";
import { GifsService } from '../../services/gifs.service';

const imageUrls: string[] = [
/*   "https://flowbite.s3.amazonaws.com/docs/gallery/square/image.jpg",
  "https://flowbite.s3.amazonaws.com/docs/gallery/square/image-1.jpg",
  "https://flowbite.s3.amazonaws.com/docs/gallery/square/image-2.jpg",
  "https://flowbite.s3.amazonaws.com/docs/gallery/square/image-3.jpg",
  "https://flowbite.s3.amazonaws.com/docs/gallery/square/image-4.jpg",
  "https://flowbite.s3.amazonaws.com/docs/gallery/square/image-5.jpg",
  "https://flowbite.s3.amazonaws.com/docs/gallery/square/image-6.jpg",
  "https://flowbite.s3.amazonaws.com/docs/gallery/square/image-7.jpg",
  "https://flowbite.s3.amazonaws.com/docs/gallery/square/image-8.jpg",
  "https://flowbite.s3.amazonaws.com/docs/gallery/square/image-9.jpg",
  "https://flowbite.s3.amazonaws.com/docs/gallery/square/image-10.jpg",
  "https://flowbite.s3.amazonaws.com/docs/gallery/square/image-11.jpg" */
];

@Component({
  selector: 'app-trending-page',
  //imports: [GifsListComponent],
  templateUrl: './trending-page.component.html',
})
export default class TrendingPageComponent {
  //gifs = signal(imageUrls);

  gifService = inject(GifsService);

  scrollDivRef = viewChild<ElementRef<HTMLDivElement>>('groupDiv')

  onScroll(event: Event){
    const scrollDiv = this.scrollDivRef()?.nativeElement;
    if(!scrollDiv) return;

    const scrollTop = scrollDiv.scrollTop;
    const clientHeignt = scrollDiv.clientHeight;
    const scrollHeight = scrollDiv.scrollHeight;
    const isAtBottom = scrollTop + clientHeignt + 300 >= scrollHeight;

    console.log({isAtBottom});
  }
}
