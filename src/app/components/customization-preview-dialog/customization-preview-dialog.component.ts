import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-customization-preview-dialog',
  templateUrl: './customization-preview-dialog.component.html',
  styleUrls: ['./customization-preview-dialog.component.scss']
})
export class CustomizationPreviewDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}
