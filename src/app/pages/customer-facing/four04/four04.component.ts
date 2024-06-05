import { Component } from '@angular/core';
import IProduct from 'src/app/models/product.interface';
import { ProductService } from 'src/app/services/product/product.service';

@Component({
  selector: 'app-four04',
  templateUrl: './four04.component.html',
  styleUrl: './four04.component.scss'
})
export class Four04Component {
  loading = false;
  bestSellingProducts: IProduct[] = [];

  constructor(private readonly productsService: ProductService) {}

  async ngOnInit() {
    this.loading = true;
    this.bestSellingProducts = await this.productsService.getProducts(
      'createdAt',
      false,
      [['active', '==', true]],
      6
    ).then((res) => {
      this.loading = false;
      return res;
    });
  }
}
