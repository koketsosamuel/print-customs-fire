import { Injectable } from '@angular/core';
import { LoadingSpinnerService } from '../loading-spinner/loading-spinner.service';
import { IPrintingMethod } from 'src/app/models/printing-method.interface';
import { DbService } from '../db/db.service';
import { AlertService } from '../alert/alert.service';
import { StorageService } from '../storage/storage.service';
import IProduct, { IImage } from 'src/app/models/product.interface';
import { WhereFilterOp } from '@angular/fire/firestore';
import { AngularFirestoreDocument } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class PrintingMethodsService {
  COLLECTION_NAME = 'PrintingMethods' as const;

  constructor(
    private readonly loadingSpinnerService: LoadingSpinnerService,
    private readonly db: DbService,
    private readonly alertService: AlertService,
    private readonly storage: StorageService,
  ) {}

  async add(printingMethod: IPrintingMethod) {
    let savedPrintingMethod;
    try {
      this.loadingSpinnerService.show();
      const imagesBlob = [...(printingMethod.images || [])];
      printingMethod.images = [];
      savedPrintingMethod = await this.db
        .addDocument(this.COLLECTION_NAME, printingMethod)
        .then((doc) => {
          this.alertService.success('Printing method info successfully saved');
          return doc;
        });

      await this.storage.uploadImages(
        imagesBlob || [],
        {
          id: savedPrintingMethod.id || '',
          name: savedPrintingMethod.name,
        },
        this.COLLECTION_NAME
      );
      this.alertService.success('Printing method image successfully saved');

      this.alertService.success(
        'Printing method status successfully updated to active'
      );
    } catch (error: any) {
      this.loadingSpinnerService.hide();
      this.alertService.error(
        'Error saving printing method: ' + error.toString()
      );
    } finally {
      this.loadingSpinnerService.hide();
    }
  }

  async update(id: string, data: any, newImages: Blob[] | null) {
    try {
      this.loadingSpinnerService.show();

      if (newImages?.length) {
        if (data.images?.length) {
          await this.storage.removeImages(
            data.images.map((image: IImage) => image.path)
          );
        }
        data.images = [];
        await this.db.updateById(this.COLLECTION_NAME, id, data);
        await this.storage.uploadImages(
          newImages,
          { id, name: data.name },
          this.COLLECTION_NAME
        );
      } else {
        await this.db.updateById(this.COLLECTION_NAME, id, data);
      }

      this.alertService.success('Printing method successfully updated');
    } catch (error: any) {
      this.loadingSpinnerService.hide();
      this.alertService.error(
        'Error updating printing method: ' + error.toString()
      );
    } finally {
      this.loadingSpinnerService.hide();
    }
  }

  getPrintingMethod(id: string): Promise<any> {
    return this.db.getDocumentById(this.COLLECTION_NAME, id);
  }

  getPrintingMethods(
    sortBy = 'name',
    asc = true,
    where: [string, WhereFilterOp, any][] = [],
    limit: number | null = 20,
    after: AngularFirestoreDocument | null = null
  ) {
    return this.db.getDocumentsOrderedByWhere(
      this.COLLECTION_NAME,
      sortBy,
      asc,
      where,
      limit,
      after
    );
  }

  getMethodsForPositionOnProduct(product: IProduct, positionId: string) {
    return Promise.all(
      product.printingMethods[positionId || ''].map(
        async (methodId) => {
          return (
            await this.getPrintingMethod(methodId)
          ).value;
        }
      )
    );
  }
}
