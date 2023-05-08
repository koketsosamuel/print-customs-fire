import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IImageCardOption } from 'src/app/models/image-card-option.interface';

@Component({
  selector: 'app-image-card-options-selection',
  templateUrl: './image-card-options-selection.component.html',
  styleUrls: ['./image-card-options-selection.component.scss'],
})
export class ImageCardOptionsSelectionComponent {
  @Input() options: IImageCardOption[] = [];
  @Output() changeEvent = new EventEmitter<string[]>();

  sendValues() {
    this.changeEvent.emit(
      this.options
        .filter((opt) => opt.selected)
        .map((opt) => opt.object[opt.value])
    );
  }
}
