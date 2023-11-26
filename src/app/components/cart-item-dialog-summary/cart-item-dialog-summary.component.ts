import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-cart-item-dialog-summary',
  templateUrl: './cart-item-dialog-summary.component.html',
  styleUrls: ['./cart-item-dialog-summary.component.scss']
})
export class CartItemDialogSummaryComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }
}
