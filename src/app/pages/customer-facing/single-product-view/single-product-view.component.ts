import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import IProduct from 'src/app/models/product.interface';
import { AlertService } from 'src/app/services/alert/alert.service';
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
  selectedColor: string | null = null;
  quantity: number = 1;
  hasSubVariations: boolean = false;

  constructor(
    private readonly productService: ProductService,
    private readonly route: ActivatedRoute,
    private readonly loadingSpinnerService: LoadingSpinnerService,
    private readonly alertService: AlertService,
    private readonly router: Router
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
        console.log(this.product);
        this.hasSubVariations =
          !!this.product?.variations.subVariations?.options.length;

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

  selectColor(color: string | null) {
    this.selectedColor = color;
  }

  customize() {
    if (!this.selectedColor) {
      this.alertService.error('Select a color first');
    } else {
      this.router.navigate(['/customize/' + this.product?.id], {});
    }
  }
}
