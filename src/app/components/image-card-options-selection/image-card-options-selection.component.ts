import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  AfterViewInit,
} from '@angular/core';
import { IImageCardOption } from 'src/app/models/image-card-option.interface';

@Component({
  selector: 'app-image-card-options-selection',
  templateUrl: './image-card-options-selection.component.html',
  styleUrls: ['./image-card-options-selection.component.scss'],
})
export class ImageCardOptionsSelectionComponent {
  @Input() options: IImageCardOption[] = [];
  @Output() changeEvent = new EventEmitter<string[]>();
  selected: any[] = [];

  sendValues() {
    const values = [
      ...this.options
        .filter((opt) => opt.selected)
        .map((opt) => opt.object?.[opt.value]),
    ];
    this.selected = values?.map((v) => this.getSelectedOptionValues(v));

    this.changeEvent.emit(values);
    this;
  }

  removeOpt(option: string) {
    this.options.filter(
      (opt) => opt.selected && opt.object?.[opt.value] === option
    )[0].selected = false;
    this.sendValues();
  }

  getSelectedOptionValues(option: string) {
    return this.options.filter(
      (opt) => opt.selected && opt.object?.[opt.value] === option
    )[0];
  }
}
