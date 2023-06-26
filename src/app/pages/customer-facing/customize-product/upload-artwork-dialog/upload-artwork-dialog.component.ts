import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  ViewChild,
} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fabric } from 'fabric';
import { IArtwork } from 'src/app/models/artwork.interface';
import { IPrintingInfo } from 'src/app/models/printing-info.interface';

@Component({
  selector: 'app-upload-artwork-dialog',
  templateUrl: './upload-artwork-dialog.component.html',
  styleUrls: ['./upload-artwork-dialog.component.scss'],
})
export class UploadArtworkDialogComponent implements AfterViewInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { printingInfo: IPrintingInfo; viewOnly: boolean }
  ) {}
  canvas!: fabric.Canvas;
  artwork: IArtwork = {
    image: null,
    mockup: null,
  };
  canvasImageRef: any = null;

  ngAfterViewInit(): void {
    this.canvas = new fabric.Canvas('canvas');
    if (this.data.printingInfo.artwork) {
      this.artwork = { ...(this.data.printingInfo.artwork as IArtwork) };
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
          let scaleFactor;

          if (imageAspectRatio > canvasAspectRatio) {
            // Image is wider than the canvas
            scaleFactor = canvasWidth / image.width;
          } else {
            // Image is taller or has the same aspect ratio as the canvas
            scaleFactor = canvasHeight / image.height;
          }

          const scaledImage = new fabric.Image(image.getElement(), {
            left: 0,
            top: 0,
            scaleX: scaleFactor,
            scaleY: scaleFactor,
          });

          if (this.canvasImageRef) {
            this.canvas.remove(this.canvasImageRef);
          }
          this.canvasImageRef = scaledImage;
          this.artwork.image = file; // store original image file
          this.canvas.add(scaledImage);
        });
      };

      reader.readAsDataURL(file);
    }
  }

  saveCanvasView(): void {
    let json: any = this.canvas.toJSON();
    delete json.objects[0].src;
    this.artwork.mockup = json;
  }

  importJsonToCanvas(): void {
    const reader: FileReader = new FileReader();
    const ref = this;
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const imageUrl: string = e.target?.result as string;
      this.artwork.mockup.objects[0].src = imageUrl;
      this.canvas.loadFromJSON(
        this.artwork.mockup,
        () => {
          this.canvas.renderAll();
        },
        (o: any, object: any) => {
          object.set('selectable', !ref.data.viewOnly);
        }
      );
    };

    reader.readAsDataURL(this.artwork.image as Blob);
  }
}
