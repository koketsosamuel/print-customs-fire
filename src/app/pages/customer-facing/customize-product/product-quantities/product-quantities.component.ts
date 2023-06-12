import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ISubVariation } from 'src/app/models/variation.interface';

@Component({
  selector: 'app-product-quantities',
  templateUrl: './product-quantities.component.html',
  styleUrls: ['./product-quantities.component.scss'],
})
export class ProductQuantitiesComponent implements OnInit {
  @Input() subVariations!: ISubVariation;
  @Output() change = new EventEmitter<Record<string, any>>();
  optionQuantities: Record<string, any> = {};
  validated = false;

  constructor() {}

  ngOnInit() {
    this.subVariations.options.forEach((option) => {
      this.optionQuantities[option.name] = { quantities: null, option };
    });
  }

  validate() {
    this.validated =
      Object.values(this.optionQuantities).filter(
        (opt) => opt.quantities && opt.quantities > 0
      ).length > 0;
  }

  saveQuantities() {
    this.change.emit(this.optionQuantities);
  }
}
