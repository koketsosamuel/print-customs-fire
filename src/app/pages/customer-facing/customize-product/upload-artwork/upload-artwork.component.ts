import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IPrintingInfo } from 'src/app/models/printing-info.interface';
import { UploadArtworkDialogComponent } from '../upload-artwork-dialog/upload-artwork-dialog.component';

@Component({
  selector: 'app-upload-artwork',
  templateUrl: './upload-artwork.component.html',
  styleUrls: ['./upload-artwork.component.scss'],
})
export class UploadArtworkComponent {
  @Input() printingInfo: IPrintingInfo[] = [];

  constructor(private readonly dialog: MatDialog) {}

  uploadArt(info: IPrintingInfo) {
    this.dialog.open(UploadArtworkDialogComponent, { data: { info } });
  }
}
