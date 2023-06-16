import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-method-select-dialog',
  templateUrl: './method-select-dialog.component.html',
  styleUrls: ['./method-select-dialog.component.scss'],
})
export class MethodSelectDialogComponent {
  methodSelected: string[] = [];
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    console.log(data);
    for (let i = 0; i < data.methods.methods; i++) {
      console.log(data.methods.methods[i]);
    }
  }
}
