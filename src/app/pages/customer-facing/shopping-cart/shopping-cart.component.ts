import { Component, OnInit } from '@angular/core';
import { ICartItem } from 'src/app/models/cart.interface';
import { CartService } from 'src/app/services/cart/cart.service';
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
    private readonly loadingSpinnerService: LoadingSpinnerService
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
}
