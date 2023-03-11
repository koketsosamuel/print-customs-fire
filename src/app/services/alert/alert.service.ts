import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor(private readonly snackbar: MatSnackBar) {}

  success(message: string) {
    this.snackbar.open(message, 'close', {
      duration: 3000,
      panelClass: ['success'],
    });
  }

  error(message: string) {
    this.snackbar.open(message, 'close', {
      duration: 3000,
      panelClass: ['danger'],
    });
  }
}
