import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  ViewChild,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fabric } from 'fabric';
import { ICanvasPositionInfo } from 'src/app/models/canvas-position-info.interface';
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

  async saveCanvasView() {
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
    this.dialogRef.close({ json, viewExport: await this.canvasToBase64(
      this.data.printingInfo.printingPosition.images?.[0]?.link as string,
      this.canvas.toDataURL(),
      this.data.printingInfo.printingPosition.canvasPositionInfo
    ) });
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

  canvasToBase64(imageUrl: string, overlayUrl: string, canvasPositionInfo: ICanvasPositionInfo) {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      canvas.width = canvasPositionInfo.maxW / 2;
      canvas.height = canvasPositionInfo.maxH / 2;
      const context = canvas.getContext('2d') as CanvasRenderingContext2D;


      const background = new Image();
      background.crossOrigin = 'Anonymous'; // Enable CORS for the background image
      background.onload = function () {
        // Draw the background image
        context.drawImage(background, 0, 0, canvas.width, canvas.height);

        // Create a new image element for the overlay
        const overlay = new Image();
        const overlayImage = new Image();
        overlayImage.src = overlayUrl;
        overlayImage.onload = function () {
          context.drawImage(overlayImage, (canvasPositionInfo.x + 2) / 2, (canvasPositionInfo.y + 2) / 2, overlayImage.width / 2, overlayImage.height / 2);
          resolve(canvas.toDataURL());
        };

        overlay.src = overlayUrl;
      };
      background.src = imageUrl;
    });
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

  resetEdits() {
    if (this.canvasImageRef) {
      this.canvasImageRef.set({
        left: 0,
        top: 0,
        scaleX: this.scaleFactor,
        scaleY: this.scaleFactor,
      });
      this.canvas.renderAll();
    }
  }

  enlargeImage(factor = 1.1) {
    if (this.canvasImageRef) {
      // Increase the scale by the factor
      this.canvasImageRef.scaleX *= factor;
      this.canvasImageRef.scaleY *= factor;
      this.canvas.renderAll();
    } else {
      console.log('canvasImageRef is not defined');
    }
  }

  decreaseImage(factor = 0.9) {
    if (this.canvasImageRef) {
      // Decrease the scale by the factor
      this.canvasImageRef.scaleX *= factor;
      this.canvasImageRef.scaleY *= factor;
      this.canvas.renderAll();
    } else {
      console.log('canvasImageRef is not defined');
    }
  }

  moveImage(direction: 'up' | 'down' | 'left' | 'right', step = 10) {
    if (this.canvasImageRef) {
      switch (direction) {
        case 'up':
          this.canvasImageRef.top -= step;
          break;
        case 'down':
          this.canvasImageRef.top += step;
          break;
        case 'left':
          this.canvasImageRef.left -= step;
          break;
        case 'right':
          this.canvasImageRef.left += step;
          break;
        default:
          return;
      }
      this.canvas.renderAll();
    }
  }

  rotateImage(direction: 'left' | 'right') {
    if (this.canvasImageRef) {
      const angle = direction === 'left' ? -90 : 90;
      this.canvasImageRef.rotate((this.canvasImageRef.angle + angle) % 360);
      this.canvas.renderAll();
    } else {
      console.log('canvasImageRef is not defined');
    }
  }
}
