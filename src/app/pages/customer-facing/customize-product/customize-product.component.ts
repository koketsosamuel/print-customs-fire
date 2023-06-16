import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IPrintingMethod } from 'src/app/models/printing-method.interface';
import { IPrintingPosition } from 'src/app/models/printing-position.interface';
import IProduct from 'src/app/models/product.interface';
import { IVariationOption } from 'src/app/models/variation.interface';
import { AlertService } from 'src/app/services/alert/alert.service';
import { LoadingSpinnerService } from 'src/app/services/loading-spinner/loading-spinner.service';
import { ProductService } from 'src/app/services/product/product.service';

@Component({
  selector: 'app-customize-product',
  templateUrl: './customize-product.component.html',
  styleUrls: ['./customize-product.component.scss'],
})
export class CustomizeProductComponent implements OnInit {
  hasSubVariations = false;
  product!: IProduct;
  quantities: Record<
    string,
    { quantities: string | null; option: IVariationOption }
  > = {};
  printingPositionsSelected: IPrintingPosition[] = [];

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
    this.loadingSpinnerService.show();
    return this.productService
      .getProduct(productId || '')
      .then((data: any) => {
        this.product = data.value;
        console.log(this.product);
        this.hasSubVariations =
          !!this.product?.variations.subVariations?.options.length;
      })
      .finally(() => {
        this.loadingSpinnerService.hide();
      });
  }

  setQuantities(event: any) {
    this.quantities = event;
  }

  setPrintingLocations(locations: any) {
    this.printingPositionsSelected = locations;
    console.log(this.printingPositionsSelected);
  }
}
