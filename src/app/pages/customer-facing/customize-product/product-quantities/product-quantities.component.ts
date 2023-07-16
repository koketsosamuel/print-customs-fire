import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import IProduct from 'src/app/models/product.interface';
import { ISubVariation } from 'src/app/models/variation.interface';

@Component({
  selector: 'app-product-quantities',
  templateUrl: './product-quantities.component.html',
  styleUrls: ['./product-quantities.component.scss'],
})
export class ProductQuantitiesComponent implements OnInit {
  @Input({ required: true }) product!: IProduct;
  @Input() quantityAvailable: number = 0;
  @Input() totalQuantity: number = 0;
  @Input() chosenVariationIndex: number = -1;
  @Output() quantityChanged = new EventEmitter<Record<string, any>>();
  optionQuantities: Record<string, any> = {};
  validated = false;

  constructor() {}

  ngOnInit() {
    if (this.product.variations.subVariations) {
      this.product.variations.subVariations.options.forEach((option) => {
        this.optionQuantities[option.name] = { quantities: null, option };
      });
    }
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
