import { Component, Input } from '@angular/core';
import { IImage } from 'src/app/models/product.interface';
import { ImagesFullscreenService } from 'src/app/services/images-fullscreen/images-fullscreen.service';

@Component({
  selector: 'app-single-product-view-images',
  templateUrl: './single-product-view-images.component.html',
  styleUrls: ['./single-product-view-images.component.scss'],
})
export class SingleProductViewImagesComponent {
  @Input() images: IImage[] = [
    { link: 'https://picsum.photos/800', path: '' },
    { link: 'https://picsum.photos/802', path: '' },
    { link: 'https://picsum.photos/804', path: '' },
    { link: 'https://picsum.photos/806', path: '' },
    { link: 'https://picsum.photos/808', path: '' },
    { link: 'https://picsum.photos/800', path: '' },
    { link: 'https://picsum.photos/802', path: '' },
    { link: 'https://picsum.photos/804', path: '' },
    { link: 'https://picsum.photos/806', path: '' },
    { link: 'https://picsum.photos/808', path: '' },
  ];

  @Input() index: number = 0;
  @Input() fullscreenMode = false;

  constructor(
    private readonly imagesFullscreenService: ImagesFullscreenService
  ) {}

  fullscreenView() {
    this.imagesFullscreenService.openDialogue(this.images, this.index);
  }
}
