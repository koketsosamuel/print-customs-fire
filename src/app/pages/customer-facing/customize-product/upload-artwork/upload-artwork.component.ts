import { Component, Input } from '@angular/core';
import { IPrintingInfo } from 'src/app/models/printing-info.interface';

@Component({
  selector: 'app-upload-artwork',
  templateUrl: './upload-artwork.component.html',
  styleUrls: ['./upload-artwork.component.scss'],
})
export class UploadArtworkComponent {
  @Input() printingInfo: IPrintingInfo[] = [];

  uploadArt(info: IPrintingInfo) {}
}
