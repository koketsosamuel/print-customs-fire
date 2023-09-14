import { Component, OnInit } from '@angular/core';
import { ICartItem } from 'src/app/models/cart.interface';
import { CartService } from 'src/app/services/cart/cart.service';
import { LoadingSpinnerService } from 'src/app/services/loading-spinner/loading-spinner.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss']
})
export class ShoppingCartComponent implements OnInit {

  items: ICartItem[] = []

  constructor(private readonly cartService: CartService, private readonly loadingSpinnerService: LoadingSpinnerService) {

  }

  ngOnInit() {
    this.loadingSpinnerService.show();
    this.cartService.getUserCart().then(cart => {
      this.items = cart.cartItems as ICartItem[];
    }).finally(() => {
      this.loadingSpinnerService.hide();
    })
  }
}
