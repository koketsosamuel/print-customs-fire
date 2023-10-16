import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-filter-and-sort-dialogue',
  templateUrl: './filter-and-sort-dialogue.component.html',
  styleUrls: ['./filter-and-sort-dialogue.component.scss']
})
export class FilterAndSortDialogueComponent {

  constructor(private readonly dialogRef: MatDialogRef<FilterAndSortDialogueComponent>) {}

  closeDialog(e: any) {
    this.dialogRef.close()
  }
}
