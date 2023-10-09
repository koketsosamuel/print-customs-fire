import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LoadingSpinnerComponent } from 'src/app/components/loading-spinner/loading-spinner.component';

@Injectable({
  providedIn: 'root',
})
export class LoadingSpinnerService {
  dialogRef: any = null;
  open = 0;

  constructor(private readonly dialog: MatDialog) {}

  show() {
    this.open += 1;
    if (this.open == 1) {
      this.dialogRef = this.dialog.open(LoadingSpinnerComponent, {
        maxHeight: '70vh',
        maxWidth: '70vw',
        disableClose: true,
      });
    }
  }

  hide() {
    this.open -= 1;
    if (this.open == 0) {
      this.dialogRef && this.dialogRef.close();
      this.dialogRef = null;
    } else if (this.open < 0) {
      this.open == 0;
    }
  }
}
