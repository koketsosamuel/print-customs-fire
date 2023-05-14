import { Injectable } from '@angular/core';
import { LoadingSpinnerService } from '../loading-spinner/loading-spinner.service';
import { IBrand } from 'src/app/models/brand.interface';
import { DbService } from '../db/db.service';
import { StorageService } from '../storage/storage.service';
import { AlertService } from '../alert/alert.service';
import { AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { IImage } from 'src/app/models/product.interface';
import { WhereFilterOp } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class BrandsService {
  COLLECTION_NAME = 'Brand' as const;

  constructor(
    private readonly loadingSpinnerService: LoadingSpinnerService,
    private readonly db: DbService,
    private readonly storageService: StorageService,
    private readonly alertService: AlertService,
    private readonly router: Router
  ) {}

  async addBrand(brand: IBrand) {
    try {
      this.loadingSpinnerService.show();
      const imagesBlob = [...(brand.images || [])];
      brand.images = [];
      const savedBrand = await this.db.addDocument(this.COLLECTION_NAME, brand);
      this.alertService.success('brand saved!');
      await this.storageService.uploadImages(
        imagesBlob || [],
        {
          id: savedBrand.id || '',
          name: savedBrand.name,
        },
        this.COLLECTION_NAME
      );
      this.router.navigate(['/brand/view']);
    } catch (error) {
      this.alertService.error('Error saving brand, please retry!');
    } finally {
      this.loadingSpinnerService.hide();
    }
  }

  async getBrands(
    sortBy = 'name',
    asc = true,
    where: [string, WhereFilterOp, any][] = [],
    limit: number | null = null,
    after: AngularFirestoreDocument | null = null
  ) {
    return await this.db.getDocumentsOrderedByWhere(
      this.COLLECTION_NAME,
      sortBy,
      asc,
      where,
      limit,
      after
    );
  }

  getBrandById(id: string) {
    return this.db.getDocumentById(this.COLLECTION_NAME, id);
  }

  async update(id: string, data: IBrand | any, newImages: any[]) {
    try {
      this.loadingSpinnerService.show();

      if (newImages?.length) {
        if (data.images?.length) {
          await this.storageService.removeImages(
            data.images.map((image: IImage) => image.path)
          );
        }
        data.images = [];
        await this.storageService.uploadImages(
          newImages,
          { id, name: data.name },
          this.COLLECTION_NAME
        );
      }

      await this.db.updateById(this.COLLECTION_NAME, id || '', data);
      this.alertService.success('Brand has been updated');
    } catch (err) {
      this.alertService.error('Error updating brand');
    } finally {
      this.loadingSpinnerService.hide();
    }
  }
}
