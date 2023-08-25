import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import IProduct, { IImage } from 'src/app/models/product.interface';
import { ConfirmDialogueService } from 'src/app/services/confirm-dialogue/confirm-dialogue.service';
import { LoadingSpinnerService } from 'src/app/services/loading-spinner/loading-spinner.service';
import { ProductService } from 'src/app/services/product/product.service';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-manage-images',
  templateUrl: './manage-images.component.html',
  styleUrls: ['./manage-images.component.scss'],
})
export class ManageImagesComponent {
  @Input() product!: IProduct;
  @Output() refreshProduct = new EventEmitter<boolean>();
  imageFiles: any[] = [];
  processingUpload: boolean = false;
  deletedImages: string[] = [];

  constructor(
    private readonly storageService: StorageService,
    private readonly confirmDialogue: ConfirmDialogueService,
    private readonly loadingSpinner: LoadingSpinnerService,
    private readonly productService: ProductService
  ) {}

  selectImages(event: any) {
    this.imageFiles = [];
    for (let i = 0; i < event?.files.length; i++) {
      this.imageFiles?.push(event?.files[i]);
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.product?.images || [],
      event.previousIndex,
      event.currentIndex
    );
  }

  removeNewImage(name: string) {
    this.imageFiles = this.imageFiles.filter((i) => i.name != name);
  }

  uploadImages() {
    const refreshTime = (10 + (this.imageFiles.length - 1) * 2) * 1000; // 30s + 15s per additional image
    this.productService
      .uploadProductImages(this.product, this.imageFiles)
      .then((res) => {
        console.log(res);
        
        this.imageFiles = [];
        this.processImagesLoading(refreshTime);
      });
  }

  refreshImages() {
    this.refreshProduct.emit(true);
  }

  removeCurrentImage(path: string) {
    this.confirmDialogue.openDialogue(
      'Are you sure you want to delete this image?',
      () => {
        this.loadingSpinner.show();
        this.storageService
          .removeFile(path)
          .then(() => {
            this.processImagesLoading(30 * 1000);
            this.product.images = this.product.images?.filter(
              (i) => i.path != path
            );
            this.productService
              .update(this.product.id || '', {
                images: this.product.images,
              })
              .then(() => {
                this.processingUpload = false;
              });
          })
          .finally(() => {
            this.loadingSpinner.hide();
          });
      }
    );
  }

  processImagesLoading(refreshTime: number) {
    this.processingUpload = true;
    setTimeout(() => {
      this.processingUpload = false;
      this.refreshImages();
    }, refreshTime);
  }

  updateImageSortOrder() {
    this.loadingSpinner.show();
    this.productService
      .update(this.product.id || '', this.product)
      .finally(() => {
        this.loadingSpinner.hide();
      });
  }
}
