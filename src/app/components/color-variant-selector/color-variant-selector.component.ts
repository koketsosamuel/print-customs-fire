import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IVariationOption } from 'src/app/models/variation.interface';

@Component({
  selector: 'app-color-variant-selector',
  templateUrl: './color-variant-selector.component.html',
  styleUrls: ['./color-variant-selector.component.scss'],
})
export class ColorVariantSelectorComponent {
  @Input({ required: true }) options: IVariationOption[] = [];
  @Input({ required: true }) selectedVariantIndex: number = -1;
  @Input() readonly: boolean = false;
  @Output() variantChanged = new EventEmitter<number>();

  selectVariant(index: number) {
    this.selectedVariantIndex = index;
    this.variantChanged.emit(index);
  }
}
