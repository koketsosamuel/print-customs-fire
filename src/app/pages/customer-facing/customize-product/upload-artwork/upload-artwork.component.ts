import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IPrintingInfo } from 'src/app/models/printing-info.interface';
import { UploadArtworkDialogComponent } from '../upload-artwork-dialog/upload-artwork-dialog.component';
import { IArtwork } from 'src/app/models/artwork.interface';

@Component({
  selector: 'app-upload-artwork',
  templateUrl: './upload-artwork.component.html',
  styleUrls: ['./upload-artwork.component.scss'],
})
export class UploadArtworkComponent implements OnInit {
  @Input() printingInfo: IPrintingInfo[] = [];
  @Output() change = new EventEmitter<IPrintingInfo[]>();
  validated: boolean = false;

  constructor(private readonly dialog: MatDialog) {}

  ngOnInit(): void {
    this.validate();
  }

  uploadArt(printingInfo: IPrintingInfo, viewOnly = false) {
    this.dialog
      .open(UploadArtworkDialogComponent, {
        data: { printingInfo, viewOnly },
        maxWidth: '100vw',
        maxHeight: '100vh',
        panelClass: 'custom-dialog-container',
      })
      .afterClosed()
      .subscribe((artwork: null | {json: Record<string, any>, viewExport: string}) => {
        if (artwork) {
          printingInfo.artwork = artwork['json'];
          printingInfo.exportView = artwork.viewExport;
          this.validate();
        }
      });
  }

  saveArtWork() {
    this.change.emit(this.printingInfo);
  }

  validate() {
    this.validated = !!!this.printingInfo.find((pi) => !pi.artwork);
  }
}
