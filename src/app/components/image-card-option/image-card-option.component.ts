import { Component, Input } from '@angular/core';
import { IImageCardOption } from 'src/app/models/image-card-option.interface';

@Component({
  selector: 'app-image-card-option',
  templateUrl: './image-card-option.component.html',
  styleUrls: ['./image-card-option.component.scss'],
})
export class ImageCardOptionComponent {
  @Input() imageSelectOption: IImageCardOption = {
    name: '',
    value: '',
    object: {},
    selected: false,
    imgSrc: '',
  };

  getImageCss(url: string) {
    return `url(${url})`;
  }

  getCanvasPos() {
    return {
      width: this.getPosPercentage(
        this.imageSelectOption.object['canvasPositionInfo'].w,
        this.imageSelectOption.object['canvasPositionInfo'].maxW
      ),
      height: this.getPosPercentage(
        this.imageSelectOption.object['canvasPositionInfo'].h,
        this.imageSelectOption.object['canvasPositionInfo'].maxH
      ),

      left: this.getPosPercentage(
        this.imageSelectOption.object['canvasPositionInfo'].x,
        this.imageSelectOption.object['canvasPositionInfo'].maxW
      ),
      top: this.getPosPercentage(
        this.imageSelectOption.object['canvasPositionInfo'].y,
        this.imageSelectOption.object['canvasPositionInfo'].maxH
      ),
    };
  }

  getPosPercentage(value: number, total: number) {
    return Math.ceil((value / total) * 100) + '%';
  }

  toggleSelection() {
    this.imageSelectOption.selected = !this.imageSelectOption.selected;
  }
}
