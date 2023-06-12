import { Component, Input } from '@angular/core';
import { IVariationOption } from 'src/app/models/variation.interface';

@Component({
  selector: 'app-variation-option-form',
  templateUrl: './variation-option-form.component.html',
  styleUrls: ['./variation-option-form.component.scss'],
})
export class VariationOptionFormComponent {
  @Input() option: IVariationOption = {
    name: '',
    additionalCost: 0,
    optionColor: null,
    imagePath: null,
    quantityAvailable: 0,
  };
}
