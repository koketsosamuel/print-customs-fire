import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LoadingSpinnerComponent } from 'src/app/components/loading-spinner/loading-spinner.component';

@Injectable({
  providedIn: 'root',
})
export class LoadingSpinnerService {
  dialogRef: any = null;

  constructor(private readonly dialog: MatDialog) {}

  show() {
    this.dialogRef = this.dialog.open(LoadingSpinnerComponent, {
      maxHeight: '600px',
      maxWidth: '600px',
    });
  }

  hide() {
    this.dialogRef && this.dialogRef.close();
    this.dialogRef = null;
  }
}
