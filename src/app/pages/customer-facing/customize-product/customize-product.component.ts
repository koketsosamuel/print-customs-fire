import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ICanvasPositionInfo } from 'src/app/models/canvas-position-info.interface';
import { ICostBreakdown } from 'src/app/models/cost-breakdown.interface';
import { IPrintingInfo } from 'src/app/models/printing-info.interface';
import { IPrintingMethod } from 'src/app/models/printing-method.interface';
import { IPrintingPosition } from 'src/app/models/printing-position.interface';
import IProduct from 'src/app/models/product.interface';
import { IVariationOption } from 'src/app/models/variation.interface';
import { AlertService } from 'src/app/services/alert/alert.service';
import { CartItemService } from 'src/app/services/cart-item/cart-item.service';
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
    { quantities: number | null; option: IVariationOption }
  > = {};
  totalQuantity: number = 0;
  printingPositionsSelected: IPrintingPosition[] = [];
  selectedPrintingMethods: {
    position: IPrintingPosition;
    method: IPrintingMethod;
  }[] = [];
  totalPrice: number = 0;
  printingInfo: IPrintingInfo[] = [];
  costBreakdown: ICostBreakdown = {
    productCostPerUnit: 0,
    brandingCosts: {
      locationCosts: [],
      totalCost: 0,
    },
    totalCost: 0,
    quantity: 0,
    totalProductBaseCost: 0,
  };
  selectedVariantId = '';

  constructor(
    private readonly productService: ProductService,
    private readonly route: ActivatedRoute,
    private readonly loadingSpinnerService: LoadingSpinnerService,
    private readonly alertService: AlertService,
    private readonly router: Router,
    private readonly cartItemService: CartItemService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(async (params: any) => {
      this.route.queryParams.subscribe((qParams: any) => {
        if (qParams.quantity) {
          this.totalQuantity = Number(qParams.quantity);
        }

        if (qParams.variant) {
          this.selectedVariantId = qParams.variant;
        }
      });

      await this.getProduct(params.productId);
    });
  }

  getProduct(productId: string) {
    this.loadingSpinnerService.show();
    return this.productService
      .getProduct(productId || '')
      .then((data: any) => {
        this.product = data.value;
        this.hasSubVariations =
          !!this.product.variations.options.find(o => o.id === this.selectedVariantId)
            ?.subVariations?.options.length;
      })
      .finally(() => {
        this.loadingSpinnerService.hide();
      });
  }

  setQuantities(event: any) {
    this.quantities = event;
    this.totalPriceCalculation();
  }

  setPrintingInfo(
    printingInfoArr: IPrintingInfo[],
    doNotReplaceExisting = true
  ) {
    if (!doNotReplaceExisting) {
      this.printingInfo = this.printingInfo.filter((pi) =>
        printingInfoArr
          .map((_pi) => _pi.printingPosition.id)
          .includes(pi.printingPosition.id)
      );

      for (let i = 0; i < printingInfoArr.length; i++) {
        const foundPrintingInfo = this.printingInfo.find(
          (pi) =>
            pi.printingPosition.id === printingInfoArr[i].printingPosition.id
        );
        if (!!foundPrintingInfo) {
          printingInfoArr[i] = foundPrintingInfo;
        }
      }
    }
    this.printingInfo = printingInfoArr;
  }

  setPrintingInfoArtwork(printingInfoArr: IPrintingInfo[]) {
    this.printingInfo = printingInfoArr;
    this.totalPriceCalculation(this.totalQuantity);
  }

  totalPriceCalculation(totalQuantity = 0) {
    const productBasePrice = this.product.price;
    let sum = 0;

    this.totalQuantity = totalQuantity;

    const _costBreakDown: ICostBreakdown = {
      productCostPerUnit: 0,
      brandingCosts: {
        locationCosts: [],
        totalCost: 0,
      },
      totalCost: 0,
      quantity: 0,
      totalProductBaseCost: 0,
    };

    if (this.hasSubVariations) {
      this.totalQuantity = 0;

      Object.values(this.quantities).forEach((q) => {
        this.totalQuantity += q.quantities ? q.quantities : 0;
        sum += q.quantities ? q.quantities * q.option.additionalCost : 0;
      });
    }

    sum += this.totalQuantity * productBasePrice;
    _costBreakDown.totalProductBaseCost = this.totalQuantity * productBasePrice;

    this.printingInfo
      .filter((pi) => !!pi.artwork)
      .forEach((p) => {
        const canvasInfo = p.printingPosition.canvasPositionInfo;
        const canvasArea = canvasInfo.w * canvasInfo.h;

        const chargeableArea = this.calculateChargeableAreaOfArtwork(
          p.artwork?.mockup.objects[0],
          p.printingPosition.canvasPositionInfo
        );

        const printingCost =
          p.selectedMethod!.costPerSquareInch *
          p.printingPosition.areaInSquareInches;

        const printingCostPerUnit = Math.ceil(
          printingCost * (chargeableArea / canvasArea)
        );

        const costOfPrintingForLocation =
          printingCostPerUnit * this.totalQuantity;

        // break down logic
        _costBreakDown.brandingCosts.locationCosts.push({
          location: p.printingPosition.shortName,
          costPerUnit: printingCostPerUnit,
          total: costOfPrintingForLocation,
        });

        sum += costOfPrintingForLocation;
        _costBreakDown.brandingCosts.totalCost += costOfPrintingForLocation;
        this.costBreakdown.brandingCosts.totalCost += costOfPrintingForLocation;
      });

    this.totalPrice = sum;
    _costBreakDown.totalCost = sum;
    _costBreakDown.productCostPerUnit = this.product.price;
    _costBreakDown.quantity = this.totalQuantity;
    this.costBreakdown = _costBreakDown;
  }

  calculateChargeableAreaOfArtwork(
    object: any,
    canvasInfo: ICanvasPositionInfo
  ) {
    const objectWidth = object.width * object.scaleX;
    const objectHeight = object.height * object.scaleY;
    let chargeableW = objectWidth;
    let chargeableH = objectHeight;

    if (object.left < 0) {
      chargeableW = object.width * object.scaleX + object.left;
    } else if (object.left + objectWidth > canvasInfo.w) {
      chargeableW = canvasInfo.w - object.left;
    }

    if (object.top < 0) {
      chargeableH = objectHeight + object.top;
    } else if (object.top + objectWidth > canvasInfo.h) {
      chargeableH = canvasInfo.h - object.top;
    }

    return chargeableH * chargeableW;
  }

  addToCart() {
    this.cartItemService.createCartItem(
      this.printingInfo,
      this.quantities,
      this.totalQuantity,
      this.totalPrice,
      this.product.id as string,
      this.costBreakdown,
      this.selectedVariantId || undefined
    );
  }
}
