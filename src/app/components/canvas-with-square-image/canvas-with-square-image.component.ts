import { AfterViewInit, Component, Input } from '@angular/core';
import { ICartItemPrintingInfo, IPrintingInfo } from 'src/app/models/printing-info.interface';
import { fabric } from 'fabric';

@Component({
  selector: 'app-canvas-with-square-image',
  templateUrl: './canvas-with-square-image.component.html',
  styleUrls: ['./canvas-with-square-image.component.scss']
})
export class CanvasWithSquareImageComponent {
  @Input({required: true}) printingInfo!: IPrintingInfo;

  getImageCss(url: string) {
    return `url(${url})`;
  }

  getCanvasPos() {
    console.log({
      width: this.getPosPercentage(
        this.printingInfo.printingPosition.canvasPositionInfo.w,
        this.printingInfo.printingPosition.canvasPositionInfo.maxW
      ),
      height: this.getPosPercentage(
        this.printingInfo.printingPosition.canvasPositionInfo.h,
        this.printingInfo.printingPosition.canvasPositionInfo.maxH
      ),

      left: this.getPosPercentage(
        this.printingInfo.printingPosition.canvasPositionInfo.x,
        this.printingInfo.printingPosition.canvasPositionInfo.maxW
      ),
      top: this.getPosPercentage(
        this.printingInfo.printingPosition.canvasPositionInfo.y,
        this.printingInfo.printingPosition.canvasPositionInfo.maxH
      ),
    }, this.printingInfo.printingPosition.canvasPositionInfo);
    
    return {
      width: this.getPosPercentage(
        this.printingInfo.printingPosition.canvasPositionInfo.w,
        this.printingInfo.printingPosition.canvasPositionInfo.maxW
      ),
      height: this.getPosPercentage(
        this.printingInfo.printingPosition.canvasPositionInfo.h,
        this.printingInfo.printingPosition.canvasPositionInfo.maxH
      ),

      left: this.getPosPercentage(
        this.printingInfo.printingPosition.canvasPositionInfo.x,
        this.printingInfo.printingPosition.canvasPositionInfo.maxW
      ),
      top: this.getPosPercentage(
        this.printingInfo.printingPosition.canvasPositionInfo.y,
        this.printingInfo.printingPosition.canvasPositionInfo.maxH
      ),
    };
  }

  getPosPercentage(value: number, total: number) {
    console.log(((value / total) * 100));
    
    return ((value / total) * 100 * 1).toFixed(2) + '%';
  }
}
