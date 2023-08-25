import { Component, OnInit } from '@angular/core';
import { ICartItem } from 'src/app/models/cart.interface';
import { CartService } from 'src/app/services/cart/cart.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss']
})
export class ShoppingCartComponent implements OnInit {

  items: ICartItem[] = []

  constructor(private readonly cartService: CartService) {

  }

  ngOnInit() {
    this.cartService.getUserCart().then(cart => {
      this.items = cart.cartItems as ICartItem[];
    })
  }
}
