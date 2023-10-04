import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ImagesFullscreenComponent } from 'src/app/components/images-fullscreen/images-fullscreen.component';
import { IImage } from 'src/app/models/product.interface';

@Injectable({
  providedIn: 'root',
})
export class ImagesFullscreenService {
  constructor(private readonly dialog: MatDialog) {}

  openDialogue(images: IImage[], index: number = 0) {
    this.dialog.open(ImagesFullscreenComponent, {
      data: {
        images,
        index,
      },
      maxWidth: '90vw',
    });
  }
}
