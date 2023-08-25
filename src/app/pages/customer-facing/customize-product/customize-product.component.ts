import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { ActivatedRoute, Router } from '@angular/router';
import { IArtwork } from 'src/app/models/artwork.interface';
import { ICanvasPositionInfo } from 'src/app/models/canvas-position-info.interface';
import { ICartItem } from 'src/app/models/cart.interface';
import { ICostBreakdown } from 'src/app/models/cost-breakdown.interface';
import { IPrintingInfo } from 'src/app/models/printing-info.interface';
import { IPrintingMethod } from 'src/app/models/printing-method.interface';
import { IPrintingPosition } from 'src/app/models/printing-position.interface';
import IProduct from 'src/app/models/product.interface';
import { IVariationOption } from 'src/app/models/variation.interface';
import { AlertService } from 'src/app/services/alert/alert.service';
import { CartItemService } from 'src/app/services/cart-item/cart-item.service';
import { LoadingSpinnerService } from 'src/app/services/loading-spinner/loading-spinner.service';
import { PrintingMethodsService } from 'src/app/services/printing-methods/printing-methods.service';
import { PrintingPositionsService } from 'src/app/services/printing-positions/printing-positions.service';
import { ProductService } from 'src/app/services/product/product.service';
import { StorageService } from 'src/app/services/storage/storage.service';

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
  cartItem!: ICartItem;
  selectedPrintingLocations: string[] = [];
  editMode = false;

  constructor(
    private readonly productService: ProductService,
    private readonly route: ActivatedRoute,
    private readonly loadingSpinnerService: LoadingSpinnerService,
    private readonly alertService: AlertService,
    private readonly router: Router,
    private readonly cartItemService: CartItemService,
    private readonly printingMethodsService: PrintingMethodsService,
    private readonly printingPositionsService: PrintingPositionsService,
    private readonly storage: StorageService
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

      if (params.cartItemId) {
        this.loadCartItem(params.cartItemId);
        this.editMode = true;
      } else if (params.productId) {
        await this.getProduct(params.productId);
      }
    });
  }

  getProduct(productId: string) {
    this.loadingSpinnerService.show();
    return this.productService
      .getProduct(productId || '')
      .then((data: any) => {
        this.product = data.value;
        this.hasSubVariations = !!this.product.variations.options.find(
          (o) => o.id === this.selectedVariantId
        )?.subVariations?.options.length;
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
          (p.artwork as any)?.objects[0],
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

  submitCartItem() {
    this.editMode
      ? this.cartItemService.updateCartItem(
          this.cartItem,
          this.printingInfo,
          this.quantities,
          this.totalQuantity,
          this.totalPrice,
          this.product.id as string,
          this.costBreakdown,
          true,
          this.selectedVariantId || undefined
        )
      : this.cartItemService.createCartItem(
          this.printingInfo,
          this.quantities,
          this.totalQuantity,
          this.totalPrice,
          this.product.id as string,
          this.costBreakdown,
          this.selectedVariantId || undefined
        );
  }

  async loadCartItem(cartItemId: string) {
    try {
      this.loadingSpinnerService.show();

      // fetch cart item
      this.cartItem = await this.cartItemService
        .getCartItemById(cartItemId)
        .then((res) => res.value);

      this.selectedPrintingLocations = this.cartItem.printingInfoArr!.map(
        (pi) => pi.printingPosition || ''
      );

      // fetch product
      this.product = await this.productService
        .getProduct(this.cartItem.productId)
        .then((res) => res.value);

      // set quantities
      this.quantities = this.cartItem.quantities;

      // set variant
      this.selectedVariantId = this.cartItem.variation || '';

      // set total quantity
      this.totalQuantity = this.cartItem.totalQuantity;

      // re-create printing info array
      const printingInfoArr: IPrintingInfo[] = await Promise.all(
        this.cartItem.printingInfoArr!.map(async (pi) => {
          const printingPosition: IPrintingPosition =
            await this.printingPositionsService
              .getPrintingPosition(pi.printingPosition)
              .then((res) => res.value);

          const methods =
            await this.printingMethodsService.getMethodsForPositionOnProduct(
              this.product,
              pi.printingPosition
            );

          const selectedMethod =
            methods.find((m) => m.id === pi.selectedMethod) || null;

          const artwork = await this.storage.getArtworkJSON(pi.artwork);

          return {
            printingPosition,
            methods,
            selectedMethod,
            artwork,
          };
        })
      );

      console.log(this.selectedPrintingLocations);

      this.printingInfo = printingInfoArr;
      this.totalPriceCalculation(this.totalQuantity);
    } catch (err) {
      this.alertService.error('Error loading this cart item, please retry!');
    } finally {
      this.loadingSpinnerService.hide();
    }
  }
}
