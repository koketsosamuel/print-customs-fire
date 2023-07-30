import {
  Component,
  ElementRef,
  Renderer2,
  ViewChild,
  AfterViewInit,
  Input,
  OnInit,
  Output,
  EventEmitter,
} from '@angular/core';
import { ICanvasPositionInfo } from 'src/app/models/canvas-position-info.interface';

@Component({
  selector: 'app-image-canvas-position',
  templateUrl: './image-canvas-position.component.html',
  styleUrls: ['./image-canvas-position.component.scss'],
})
export class ImageCanvasPositionComponent implements AfterViewInit, OnInit {
  @Input() imgSrc: string = '';
  @Input() displayMode: boolean = false;
  allowDrag = false;
  @ViewChild('canvasContainer') canvasContainer!: ElementRef;
  @Input() canvasPositionInfo: ICanvasPositionInfo = {
    x: 0,
    y: 0,
    w: 0,
    h: 0,
    maxH: 0,
    maxW: 0,
    z: 0,
  };
  prevPos!: ICanvasPositionInfo;
  @Output() change = new EventEmitter<ICanvasPositionInfo>();

  constructor(private renderer: Renderer2) {}
  ngOnInit(): void {
    this.prevPos = { ...this.canvasPositionInfo };
    this.imgSrc = `url('${this.imgSrc}')`;
  }

  ngAfterViewInit(): void {
    this.setCanvasPosition();
  }

  setCanvasPosition() {
    this.renderer.setStyle(
      this.canvasContainer.nativeElement,
      'transform',
      `translate3d(${this.canvasPositionInfo.x}px, ${this.canvasPositionInfo.y}px, ${this.canvasPositionInfo.z}px)`
    );
    if (this.canvasPositionInfo.h > 0 && this.canvasPositionInfo.w > 0) {
      this.renderer.setStyle(
        this.canvasContainer.nativeElement,
        'height',
        `${this.canvasPositionInfo.h}px`
      );
   
      this.renderer.setStyle(
        this.canvasContainer.nativeElement,
        'width',
        `${this.canvasPositionInfo.w}px`
      );
    }
  }

  getCanvasPosition() {
    const a = this.extractCoordinateValuesFromString(
      this.canvasContainer.nativeElement.style.transform
    );
    this.canvasPositionInfo = {
      x: this.prevPos.x + a.x,
      y: this.prevPos.y + a.y,
      z: 0,
      w: Number(
        this.canvasContainer.nativeElement.style.width?.replace('px', '')
      ),
      h: Number(
        this.canvasContainer.nativeElement.style.height?.replace('px', '')
      ),
      maxH: 600,
      maxW: 600,
    };
    this.change.emit(this.canvasPositionInfo);
  }

  extractCoordinateValuesFromString(str: string) {
    const pixelValues: number[] = [];
    const regex = /-?\d+px/g;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(str)) !== null) {
      pixelValues.push(parseInt(match[0]));
    }

    return {
      x: pixelValues[0],
      y: pixelValues[1],
      z: pixelValues[2],
    };
  }
}
