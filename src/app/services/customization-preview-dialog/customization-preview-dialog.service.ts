import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CustomizationPreviewDialogComponent } from 'src/app/components/customization-preview-dialog/customization-preview-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class CustomizationPreviewDialogService {

  constructor(
    private readonly dialog: MatDialog
  ) { }

  preview(item: Record<string, any>) {
    console.log(item);
    
    this.dialog.open(CustomizationPreviewDialogComponent, {
      data: { item },
      minWidth: '80%'
    })
  }
}
