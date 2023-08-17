import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { IVariationOption } from 'src/app/models/variation.interface';

@Component({
  selector: 'app-color-variant-selector',
  templateUrl: './color-variant-selector.component.html',
  styleUrls: ['./color-variant-selector.component.scss'],
})
export class ColorVariantSelectorComponent implements OnInit {
  @Input({ required: true }) options: IVariationOption[] = [];
  @Input({ required: true }) selectedVariantId: string = '';
  @Input() readonly: boolean = false;
  @Output() variantChanged = new EventEmitter<string>();
  selectedVariant!: IVariationOption | undefined;

  ngOnInit() {
    this.selectedVariant = this.options.find(o => o.id == this.selectedVariantId) as IVariationOption
  }

  selectVariant(id: string) {
    this.selectedVariantId = id;
    this.variantChanged.emit(id);
    this.selectedVariant = this.options.find(v => v.id === id)
  }
}
