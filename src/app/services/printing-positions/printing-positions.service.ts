import { Injectable } from '@angular/core';
import { DbService } from '../db/db.service';
import { IPrintingPosition } from 'src/app/models/printing-position.interface';
import { StorageService } from '../storage/storage.service';
import { LoadingSpinnerService } from '../loading-spinner/loading-spinner.service';
import { AlertService } from '../alert/alert.service';
import { WhereFilterOp } from '@angular/fire/firestore';
import { AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { IImage } from 'src/app/models/product.interface';

@Injectable({
  providedIn: 'root',
})
export class PrintingPositionsService {
  COLLECTION_NAME = 'PrintingPositions' as const;
  STORAGE_FOLDER_NAME = 'printing-positions-images' as const;
  printingPositions: IPrintingPosition[] = [];

  constructor(
    private readonly db: DbService,
    private readonly storage: StorageService,
    private readonly loadingSpinnerService: LoadingSpinnerService,
    private readonly alertService: AlertService
  ) {}

  async add(printingPosition: IPrintingPosition) {
    let savedPrintingPosition;
    try {
      this.loadingSpinnerService.show();
      const imagesBlob = [...(printingPosition.images || [])];
      printingPosition.images = [];
      savedPrintingPosition = await this.db
        .addDocument(this.COLLECTION_NAME, printingPosition)
        .then((doc) => {
          this.alertService.success(
            'Printing position info successfully saved'
          );
          return doc;
        });

      await this.storage.uploadImages(
        imagesBlob || [],
        {
          id: savedPrintingPosition.id || '',
          name: savedPrintingPosition.name,
        },
        this.COLLECTION_NAME,
        this.STORAGE_FOLDER_NAME
      );
      this.alertService.success('Printing position image successfully saved');
      await this.db.updateById(
        this.COLLECTION_NAME,
        savedPrintingPosition.id || '',
        {
          active: true,
        }
      );
      this.alertService.success(
        'Printing position status successfully updated to active'
      );
    } catch (error: any) {
      this.loadingSpinnerService.hide();
      this.alertService.error(
        'Error saving printing position: ' + error.toString()
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
        await this.storage.uploadImages(
          newImages,
          { id, name: data.name },
          this.COLLECTION_NAME,
          this.STORAGE_FOLDER_NAME
        );
      }

      await this.db.updateById(this.COLLECTION_NAME, data.id || '', data);
    } catch (error: any) {
      this.loadingSpinnerService.hide();
      this.alertService.error(
        'Error updating printing position: ' + error.toString()
      );
    } finally {
      this.loadingSpinnerService.hide();
    }
  }

  getPrintingPosition(id: string): Promise<any> {
    return this.db.getDocumentById(this.COLLECTION_NAME, id);
  }

  getPrintingPositions(
    sortBy = 'name',
    asc = true,
    where: [string, WhereFilterOp, any][] = [],
    limit: number | null = null,
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
}
