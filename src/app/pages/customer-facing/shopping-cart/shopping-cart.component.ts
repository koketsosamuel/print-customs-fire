import { Component, OnInit } from '@angular/core';
import { ICart, ICartItem } from 'src/app/models/cart.interface';
import { CartItemService } from 'src/app/services/cart-item/cart-item.service';
import { CartService } from 'src/app/services/cart/cart.service';
import { ConfirmDialogueService } from 'src/app/services/confirm-dialogue/confirm-dialogue.service';
import { CustomizationPreviewDialogService } from 'src/app/services/customization-preview-dialog/customization-preview-dialog.service';
import { LoadingSpinnerService } from 'src/app/services/loading-spinner/loading-spinner.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss'],
})
export class ShoppingCartComponent implements OnInit {
  items: ICartItem[] = [];
  total: number = 0;
  vat: number = 0;
  subTotal: number = 0;
  loading = true;

  constructor(
    private readonly cartService: CartService,
    private readonly cartItemService: CartItemService,
    private readonly loadingSpinnerService: LoadingSpinnerService,
    private readonly customizationPreviewDialogService: CustomizationPreviewDialogService,
    private readonly confirmDialogueServ: ConfirmDialogueService
  ) {}

  ngOnInit() {
    this.loading =true;
    this.cartService
      .getUserCart()
      .then((cart) => {
        this.items = cart.cartItems as ICartItem[];
        this.setOrderSummary();
      })
      .finally(() => {
        this.loading = false;
      });
  }

  setOrderSummary() {
    let sum = 0;
    this.items.forEach((i) => (sum += i.totalPrice));
    this.total = sum;
    this.vat = Number((this.total * 0.15).toFixed(2));
    this.subTotal = this.total - this.vat;
  }

  previewItem(item: any) {
    this.customizationPreviewDialogService.preview(item);
  }

  removeItem(item: any) {
    const thisInstance = this;
    this.confirmDialogueServ.openDialogue('Are you sure you want to delete this item?', () => {
      this.loadingSpinnerService.show();
      thisInstance.cartItemService.removeCartItem(item.id).then(() => {
        this.items = this.items.filter(i => i.id !== item.id);
      }).finally(() => {
        this.loadingSpinnerService.hide();
      });
    }, true)
  }
}
