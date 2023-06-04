import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-images-fullscreen',
  templateUrl: './images-fullscreen.component.html',
  styleUrls: ['./images-fullscreen.component.scss'],
})
export class ImagesFullscreenComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}
