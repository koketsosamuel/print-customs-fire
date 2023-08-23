import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import IProduct from 'src/app/models/product.interface';
import {
  IVariationOption,
} from 'src/app/models/variation.interface';

@Component({
  selector: 'app-product-quantities',
  templateUrl: './product-quantities.component.html',
  styleUrls: ['./product-quantities.component.scss'],
})
export class ProductQuantitiesComponent implements OnInit {
  @Input({ required: true }) product!: IProduct;
  @Input() quantityAvailable: number = 0;
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
    this.validated =
      Object.values(this.optionQuantities).filter(
        (opt) => opt.quantities && opt.quantities > 0
      ).length > 0 || this.totalQuantity > 0;
  }

  saveQuantities() {
    this.quantityChanged.emit(this.optionQuantities);
  }
}
