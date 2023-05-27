import { Component, Input } from '@angular/core';
import IProduct from 'src/app/models/product.interface';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
})
export class ProductCardComponent {
  @Input() product!: IProduct;

  addToCart(e: Event) {
    e.stopPropagation();
  }
}
