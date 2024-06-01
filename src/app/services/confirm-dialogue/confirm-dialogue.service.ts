import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogueComponent } from 'src/app/components/confirm-dialogue/confirm-dialogue.component';

@Injectable({
  providedIn: 'root',
})
export class ConfirmDialogueService {
  constructor(private readonly dialog: MatDialog) {}

  openDialogue(message: string, action: any, softConfirm: boolean = false) {
    let dialogRef = this.dialog.open(ConfirmDialogueComponent, {
      data: {
        message,
        softConfirm
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      confirmed && action();
    });
  }
}
