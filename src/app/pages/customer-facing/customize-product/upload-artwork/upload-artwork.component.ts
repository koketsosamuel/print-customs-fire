import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IPrintingInfo } from 'src/app/models/printing-info.interface';
import { UploadArtworkDialogComponent } from '../upload-artwork-dialog/upload-artwork-dialog.component';
import { IArtwork } from 'src/app/models/artwork.interface';

@Component({
  selector: 'app-upload-artwork',
  templateUrl: './upload-artwork.component.html',
  styleUrls: ['./upload-artwork.component.scss'],
})
export class UploadArtworkComponent {
  @Input() printingInfo: IPrintingInfo[] = [];

  constructor(private readonly dialog: MatDialog) {}

  uploadArt(printingInfo: IPrintingInfo, viewOnly = false) {
    this.dialog
      .open(UploadArtworkDialogComponent, {
        data: { printingInfo, viewOnly },
        panelClass: 'dialog-div',
      })
      .afterClosed()
      .subscribe((artwork: null | IArtwork) => {
        if (artwork) {
          printingInfo.artwork = artwork;
        }
        console.log(printingInfo, this.printingInfo);
      });
  }
}
