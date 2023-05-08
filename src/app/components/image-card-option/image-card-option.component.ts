import { Component, Input } from '@angular/core';
import { IImageCardOption } from 'src/app/models/image-card-option.interface';

@Component({
  selector: 'app-image-card-option',
  templateUrl: './image-card-option.component.html',
  styleUrls: ['./image-card-option.component.scss'],
})
export class ImageCardOptionComponent {
  @Input() imageSelectOption: IImageCardOption = {
    name: 'Option 1',
    value: 'dgds',
    object: {},
    selected: false,
    imgSrc: 'https://picsum.photos/200',
  };
}
