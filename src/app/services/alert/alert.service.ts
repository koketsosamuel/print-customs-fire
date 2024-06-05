import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor(private readonly snackbar: MatSnackBar) { }

  success(message: string) {
    this.snackbar.open(message, 'close', {
      duration: 5000,
      panelClass: ['success', 'toast'],
      politeness: 'assertive',
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }

  error(message: string) {
    this.snackbar.open(message, 'close', {
      duration: 5000,
      panelClass: ['error', 'toast'],
      politeness: 'assertive',
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }
}
