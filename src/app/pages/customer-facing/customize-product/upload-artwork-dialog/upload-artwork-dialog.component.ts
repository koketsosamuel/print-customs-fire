import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  ViewChild,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fabric } from 'fabric';
import { IPrintingInfo } from 'src/app/models/printing-info.interface';
import { IPrintingPosition } from 'src/app/models/printing-position.interface';

@Component({
  selector: 'app-upload-artwork-dialog',
  templateUrl: './upload-artwork-dialog.component.html',
  styleUrls: ['./upload-artwork-dialog.component.scss'],
})
export class UploadArtworkDialogComponent implements AfterViewInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { printingInfo: IPrintingInfo; viewOnly: boolean },
    private dialogRef: MatDialogRef<UploadArtworkDialogComponent>
  ) {}
  canvas!: fabric.Canvas;
  artwork: Record<string, any> | null = null;
  canvasImageRef: any = null;
  imageQualityScore = 0;
  scaleFactor: number = 0;

  ngAfterViewInit(): void {
    this.canvas = new fabric.Canvas('canvas');
    if (this.data.printingInfo.artwork) {
      this.artwork = { ...this.data.printingInfo.artwork };
      this.importJsonToCanvas();
    }
  }

  handleFileInput(event: Event): void {
    const fileList: any = (event.target as HTMLInputElement).files;

    if (fileList.length > 0) {
      const file: File = fileList[0];
      const reader: FileReader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        const imageUrl: string = e.target?.result as string;

        fabric.Image.fromURL(imageUrl, (image: any) => {
          const canvasWidth = this.canvas.getWidth();
          const canvasHeight = this.canvas.getHeight();
          const imageAspectRatio = image.width / image.height;
          const canvasAspectRatio = canvasWidth / canvasHeight;

          if (imageAspectRatio > canvasAspectRatio) {
            // Image is wider than the canvas
            this.scaleFactor = canvasWidth / image.width;
          } else {
            // Image is taller or has the same aspect ratio as the canvas
            this.scaleFactor = canvasHeight / image.height;
          }

          const scaledImage = new fabric.Image(image.getElement(), {
            left: 0,
            top: 0,
            scaleX: this.scaleFactor,
            scaleY: this.scaleFactor,
          });

          this.canvas.clear();
          this.canvasImageRef = scaledImage;
          this.computeImageQuality(
            this.canvasImageRef,
            this.data.printingInfo.printingPosition
          );

          this.canvas.add(scaledImage);
        });
      };

      reader.readAsDataURL(file);
    }
  }

  saveCanvasView(): void {
    let json: any = this.canvas.toJSON();
    this.artwork = json;
    // overriding scale because fabricjs exports them rounded to 2 decimal places

    const obj = this.canvas.getObjects()[0];
    const scaleX = obj.scaleX;
    const scaleY = obj.scaleY;

    json.objects[0] = {
      ...json.objects[0],
      scaleX,
      scaleY,
    };
    
    
    this.artwork = json;
    this.dialogRef.close(json);
    console.log(json, this.artwork);
  }

  importJsonToCanvas(): void {
    const ref = this;

    this.canvas.loadFromJSON(
      this.artwork,
      () => {
        this.canvas.renderAll();
        this.canvasImageRef = this.canvas.getObjects()[0];

        // IMPORTANT - if not set, the image will not display correctly and as expected
        this.scaleFactor = this.canvasImageRef.scaleX;
        
        this.computeImageQuality(
          this.canvasImageRef,
          this.data.printingInfo.printingPosition
        );
      },
      (o: any, object: any) => {
        object.set('selectable', !ref.data.viewOnly);
      }
    );
  }

  computeImageQuality(image: any, printingPosition: IPrintingPosition) {
    const imagePixels = image.height * image.width;
    const bestNumberOfPixels =
      printingPosition.areaInSquareInches * Math.pow(printingPosition.ppi, 2);
    const qualityScore = (imagePixels / bestNumberOfPixels) * 100;
    this.imageQualityScore = Number(qualityScore.toFixed(2));
  }

  centerHorizontal() {
    if (this.canvasImageRef) {
      this.canvasImageRef.centerH();
    }
  }

  centerVertically() {
    if (this.canvasImageRef) {
      this.canvasImageRef.centerV();
    }
  }

}
