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
  @Input() variation: IVariation | any = {
    name: '',
    options: [],
  };

  option: IVariationOption = {
    id: 'OPT_'+Math.ceil(Math.random() * 30000),
    name: '',
    additionalCost: 0,
    optionColor: '#ffffff',
    imagePath: null,
    quantityAvailable: 0,
    subVariations: {
      name: 'Sizes',
      options: [],
    },
  };
  @Input() isMain = true;

  addOption() {
    this.variation.options.push(Object.assign({}, this.option));
    this.option.id = 'OPT_'+Math.ceil(Math.random() * 30000),
    this.option.name = '';
    this.option.optionColor = '#ffffff';
    this.option.additionalCost = 0;
    this.option.quantityAvailable = 0;
    this.option.subVariations = {
      name: 'Sizes',
      options: [],
    };
  }

  removeOption(option: IVariationOption) {
    this.variation.options = this.variation.options.filter(
      (o: IVariationOption) => o != option
    );
  }
}
