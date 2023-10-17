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
  selectedVariantId: string = '';
  quantity: number = 1;
  hasSubVariations: boolean = false;
  loadingProduct: boolean = false;
  loadingRelated: boolean = false;

  constructor(
    private readonly productService: ProductService,
    private readonly route: ActivatedRoute,
    private readonly loadingSpinnerService: LoadingSpinnerService,
    private readonly alertService: AlertService,
    private readonly router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe(async (params: any) => {
      this.getProduct(params.productId);
    });
  }

  getProduct(productId: string) {
    this.loadingProduct = true;
    this.loadingRelated = true;
    return this.productService
      .getProduct(productId || '')
      .then((data: any) => {
        this.product = data.value;
        this.hasSubVariations =
          !!this.product?.variations.options?.find(v => v.id === this.selectedVariantId)
            ?.subVariations?.options.length;

        this.getRelatedProducts().finally(() => {
          this.loadingRelated = false;
        });
      }).finally(() => this.loadingProduct = false)
  }

  getRelatedProducts() {
    return this.productService
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
      })
      .catch(err => {
        this.alertService.error('Error showing product. Please reload page')
      })
      .finally(() => {
        this.loadingSpinnerService.hide();
      });
  }

  selectVariant(variantId: string) {
    this.selectedVariantId = variantId;
  }

  customize() {
    if (
      !this.selectedVariantId && this.product?.variations.options.length
    ) {
      this.alertService.error('Select a color first');
    } else {
      this.router.navigate(['/customize/' + this.product?.id], {
        queryParams: {
          quantity: !this.hasSubVariations ? this.quantity : undefined,
          variant:
            this.selectedVariantId
              ? this.selectedVariantId
              : undefined,
        },
      });
    }
  }
}
