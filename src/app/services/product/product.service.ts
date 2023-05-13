import { Injectable } from '@angular/core';
import IProduct from 'src/app/models/product.interface';
import { AlertService } from '../alert/alert.service';
import { DbService } from '../db/db.service';
import { LoadingSpinnerService } from '../loading-spinner/loading-spinner.service';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  COLLECTION_NAME = 'Product' as const;

  constructor(
    private readonly db: DbService,
    private readonly loadingSpinner: LoadingSpinnerService,
    private readonly alertService: AlertService,
    private readonly storageService: StorageService
  ) {}

  addProduct(product: IProduct) {
    this.loadingSpinner.show();
    return this.db
      .addDocument(this.COLLECTION_NAME, product)
      .then((product) => {
        this.alertService.success('Product has been added!');
        return product;
      })
      .catch((err) => {
        this.alertService.error('Error adding product! Please try again');
      })
      .finally(() => {
        this.loadingSpinner.hide();
      });
  }

  update(id: string, product: IProduct | Record<string, any>) {
    product.updatedAt = new Date();
    this.loadingSpinner.show();
    return this.db
      .updateById(this.COLLECTION_NAME, id, product)
      .then((product) => {
        this.alertService.success('Product has been updated!');
        return product;
      })
      .catch((err) => {
        this.alertService.error('Error updating product! Please try again');
      })
      .finally(() => {
        this.loadingSpinner.hide();
      });
  }

  getProduct(id: string) {
    return this.db.getDocumentById(this.COLLECTION_NAME, id);
  }

  async uploadProductImages(product: IProduct, images: Blob[]) {
    return this.storageService.uploadImages(
      images,
      { id: product.id || '', name: product.name },
      this.COLLECTION_NAME
    );
  }
}
