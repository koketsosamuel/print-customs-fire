import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { catchError } from 'rxjs';
import IProduct from 'src/app/models/product.interface';
import { AlertService } from '../alert/alert.service';
import { ConfirmDialogueService } from '../confirm-dialogue/confirm-dialogue.service';
import { LoadingSpinnerService } from '../loading-spinner/loading-spinner.service';
import { globalConfig } from 'config/config';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  BASE_IMAGE_FOLDER = 'images/';
  BASE_ARTWORK_FOLDER = 'artwork/';

  constructor(
    private readonly storage: AngularFireStorage,
    private readonly loadingSpinner: LoadingSpinnerService,
    private readonly alertService: AlertService
  ) {}

  uploadFile(folder: string, fileName: string, file: Blob) {
    return this.storage.upload(`${folder}/${fileName}`, file);
  }

  async uploadImages(
    images: Blob[] | any[],
    item: { id: string; name: string },
    collectionName: string,
    skipImageOptimization = false
  ) {
    this.loadingSpinner.show();
    const imagesUpload = await Promise.all(
      images.map(async (image) => {
        const fileName = this.getFileName(item, collectionName, image, skipImageOptimization);
        const basePath = !skipImageOptimization
          ? this.BASE_IMAGE_FOLDER
          : this.BASE_ARTWORK_FOLDER;
        const res = await this.uploadFile(
          basePath + collectionName,
          fileName,
          image
        ).catch((error) => {
          this.alertService.error('Error uploading image: ' + fileName);
        });
        return res;
      })
    )
      .then((res) => {
        this.alertService.success('Images have been uploaded!');
        return res;
      })
      .catch((err) => {
        this.alertService.error(
          'Error uploading images, please check your network and retry!'
        );
      })
      .finally(() => {
        this.loadingSpinner.hide();
      });
    return imagesUpload;
  }

  removeImage(path: string) {
    const promise = new Promise((resolve, reject) => {
      this.storage
        .ref(path)
        .delete()
        .pipe(
          catchError((err) => {
            this.alertService.error('Error removing image');
            reject(err);
            throw new Error(err);
          })
        )
        .subscribe((done) => {
          resolve(done);
        });
    });

    return promise.then((deleted) => {
      this.alertService.success(`Image removed: ${path}`);
      return deleted;
    });
  }

  removeImages(paths: string[]) {
    return Promise.all(
      paths.map(async (path) => {
        return this.removeImage(path);
      })
    );
  }

  getFileName(
    item: any,
    collection: string,
    image: Blob,
    skipImageOptimization = false
  ) {
    // productID_collectionName_productName_originalImageExt_imageName
    const itemName = item.name.replaceAll(' ', '-').replaceAll('_', '-');
    const imageExtension = image.name.split('.').pop();
    const imageName = image.name.replaceAll('_', '-');

    return `${item.id}_${collection}_${itemName}_${imageExtension}_${
      skipImageOptimization ? globalConfig.words.skip + '-' : ''
    }${imageName}`;
  }
}
