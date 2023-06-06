import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import IProduct from 'src/app/models/product.interface';
import { LoadingSpinnerService } from 'src/app/services/loading-spinner/loading-spinner.service';
import { ProductService } from 'src/app/services/product/product.service';

@Component({
  selector: 'app-single-product-view',
  templateUrl: './single-product-view.component.html',
  styleUrls: ['./single-product-view.component.scss'],
})
export class SingleProductViewComponent implements OnInit {
  product: IProduct | null = null;
  relatedProducts: IProduct[] = [];

  constructor(
    private readonly productService: ProductService,
    private readonly route: ActivatedRoute,
    private readonly loadingSpinnerService: LoadingSpinnerService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(async (params: any) => {
      console.log(params);

      this.getProduct(params.productId);
    });
  }

  getProduct(productId: string) {
    this.loadingSpinnerService.show();
    return this.productService
      .getProduct(productId || '')
      .then((data: any) => {
        this.product = data.value;
        this.getRelatedProducts();
      })
      .finally(() => {
        this.loadingSpinnerService.hide();
      });
  }

  getRelatedProducts() {
    this.loadingSpinnerService.show();
    this.productService
      .getProducts(
        'unitsSold',
        false,
        [
          ['active', '==', true],
          ['categories', 'array-contains-any', this.product?.categories],
        ],
        4
      )
      .then((res) => {
        this.relatedProducts = res.filter(
          (p: IProduct) => p.name != this.product?.name
        );
        console.log(res);
      })
      .catch(console.log)
      .finally(() => {
        this.loadingSpinnerService.hide();
      });
  }
}
