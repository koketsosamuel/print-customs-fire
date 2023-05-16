import { Component } from '@angular/core';
import IProduct from 'src/app/models/product.interface';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
})
export class ProductCardComponent {
  colors = [
    { name: 'red', hex: '#f20430' },
    { name: 'blue', hex: '#09f' },
  ];
  product: IProduct = {
    name: 'Awesome t-shirt',
    id: 'dfg',
    description: '',
    price: 0,
    promotion: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    categories: [],
    subCategories: [],
    keywords: [],
    variations: { name: '', options: [] },
    printingPositions: [],
    printingMethods: {},
    printingMethodsSearchableArr: [],
    searchTerms: [],
    brands: [],
    images: [],
  };

  addToCart(e: Event) {
    e.stopPropagation();
  }
}
