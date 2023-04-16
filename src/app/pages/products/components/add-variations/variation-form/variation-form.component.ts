import { Component, Input } from '@angular/core';
import {
  IVariation,
  IVariationOption,
} from 'src/app/models/variation.interface';

@Component({
  selector: 'app-variation-form',
  templateUrl: './variation-form.component.html',
  styleUrls: ['./variation-form.component.scss'],
})
export class VariationFormComponent {
  @Input() variation: IVariation = {
    name: '',
    options: [],
  };

  option: IVariationOption = {
    name: '',
    additionalCost: 0,
    optionColor: '#ffffff',
  };

  addOption() {
    this.variation.options.push(Object.assign({}, this.option));
    this.option.name = '';
    this.option.optionColor = '#ffffff';
    this.option.additionalCost = 0;
  }

  removeOption(option: IVariationOption) {
    this.variation.options = this.variation.options.filter((o) => o != option);
  }
}
