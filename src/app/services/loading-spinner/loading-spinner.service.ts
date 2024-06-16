import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LoadingSpinnerComponent } from 'src/app/components/loading-spinner/loading-spinner.component';

@Injectable({
  providedIn: 'root',
})
export class LoadingSpinnerService {
  private dialogRef: MatDialogRef<LoadingSpinnerComponent> | null = null;
  private openCount = 0;

  constructor(private readonly dialog: MatDialog) {}

  show() {
    this.openCount += 1;
    if (this.openCount === 1) {
      this.dialogRef = this.dialog.open(LoadingSpinnerComponent, {
        maxHeight: '70vh',
        maxWidth: '70vw',
        disableClose: true,
        minHeight: '350px',
        minWidth: '350px',
      });
    }
  }

  hide() {
    if (this.openCount > 0) {
      this.openCount -= 1;
      if (this.openCount === 0 && this.dialogRef) {
        this.dialogRef.close();
        this.dialogRef = null;
      }
    }
  }
}
