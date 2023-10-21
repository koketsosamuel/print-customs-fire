import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import IProduct from 'src/app/models/product.interface';
import { IVariationOption } from 'src/app/models/variation.interface';

@Component({
  selector: 'app-product-quantities',
  templateUrl: './product-quantities.component.html',
  styleUrls: ['./product-quantities.component.scss'],
})
export class ProductQuantitiesComponent implements OnInit {
  @Input({ required: true }) product!: IProduct;
  @Input() totalQuantity: number = 0;
  @Input() chosenVariationId: string = '';
  @Output() quantityChanged = new EventEmitter<Record<string, any>>();
  @Input({ required: true }) optionQuantities: Record<string, any> = {};
  validated = false;
  hasSubVariations = false;
  subVariations: IVariationOption[] = [];
  selectedVariation!: IVariationOption;

  constructor() {}

  ngOnInit() {
    this.hasSubVariations = !!this.product.variations?.options?.find(
      (o) => o.id == this.chosenVariationId
    )?.subVariations?.options?.length;

    if (this.hasSubVariations) {
      this.subVariations =
        this.product.variations?.options?.find(
          (o) => o.id == this.chosenVariationId
        )?.subVariations?.options || [];

      this.subVariations.forEach((option) => {
        if (this.optionQuantities[option.id] === undefined) {
          this.optionQuantities[option.id] = { quantities: null, option };
        }
      });
    }

    this.validate();
  }

  validate() {
    const minQuantitiesValid =
      Object.values(this.optionQuantities).filter(
        (opt) => opt.quantities && opt.quantities > 0
      ).length > 0;

    let maxQuantitiesValidated = true;
    if (this.hasSubVariations) {
      const selectedOptions = this.product.variations.options.find(
        (o) => o.id == this.chosenVariationId
      )?.subVariations;

      if (selectedOptions) {
        maxQuantitiesValidated = !!!selectedOptions.options.find((o) => {
          return o.quantityAvailable < this.optionQuantities[o.id].quantities;
        });
      }
    } else if (this.product.variations.options.length > 0) {
      maxQuantitiesValidated = !!!this.product.variations.options.find(
        (o) =>
          o.id == this.chosenVariationId &&
          o.quantityAvailable < this.optionQuantities[o.id].quantities
      );
    } else {
      maxQuantitiesValidated = this.product.quantity > this.totalQuantity;
    }

    // if atleast one variation exists then we need not to check is total quantity might be greater than available quantities
    if (this.product.variations.options.length > 0) {
      this.validated =
        (minQuantitiesValid && maxQuantitiesValidated) ||
        this.totalQuantity > 0;
    } else {
      this.validated =
        (minQuantitiesValid && maxQuantitiesValidated) ||
        (this.totalQuantity > 0 && this.totalQuantity < this.product.quantity);
    }
  }

  saveQuantities() {
    if (this.hasSubVariations) {
      this.totalQuantity = 0;

      Object.values(this.optionQuantities).forEach((q) => {
        this.totalQuantity += q.quantities ? q.quantities : 0;
      });
    }
    this.quantityChanged.emit({
      totalQuantity: this.totalQuantity,
      optionQuantities: this.optionQuantities,
    });
  }
}
