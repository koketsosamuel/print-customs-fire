import { Injectable } from '@angular/core';
import { AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { WhereFilterOp } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import ICategory from 'src/app/models/category.interface';
import { AlertService } from '../alert/alert.service';
import { ConfirmDialogueService } from '../confirm-dialogue/confirm-dialogue.service';
import { DbService } from '../db/db.service';
import { LoadingSpinnerService } from '../loading-spinner/loading-spinner.service';
import { StorageService } from '../storage/storage.service';
import { IImage } from 'src/app/models/product.interface';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  COLLECTION_NAME = 'Category';

  constructor(
    private db: DbService,
    private readonly router: Router,
    private readonly confirmDialog: ConfirmDialogueService,
    private readonly loadingSpinner: LoadingSpinnerService,
    private readonly alert: AlertService,
    private readonly storageService: StorageService
  ) {}

  async addCategory(category: ICategory) {
    try {
      this.loadingSpinner.show();
      const imagesBlob = [...(category.images || [])];
      category.images = [];
      const savedCategory = await this.db.addDocument(
        this.COLLECTION_NAME,
        category
      );
      this.alert.success('Category saved!');
      await this.storageService.uploadImages(
        imagesBlob || [],
        {
          id: savedCategory.id || '',
          name: savedCategory.name,
        },
        this.COLLECTION_NAME
      );
      this.router.navigate(['/category/view']);
    } catch (error) {
      this.alert.error('Error saving category, please retry!');
    } finally {
      this.loadingSpinner.hide();
    }
  }

  async getCategories(
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

  getCategoryById(id: string) {
    return this.db.getDocumentById(this.COLLECTION_NAME, id);
  }

  async update(id: string, data: ICategory | any, newImages: any[]) {
    try {
      this.loadingSpinner.show();

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
      this.alert.success('Category has been updated');
    } catch (err) {
      this.alert.error('Error updating category');
    } finally {
      this.loadingSpinner.hide();
    }
  }

  toggleStatus(category: ICategory, callback: any = async () => {}) {
    const categoryToBeUpdated = { ...category };
    categoryToBeUpdated.active = !categoryToBeUpdated.active;

    this.confirmDialog.openDialogue(
      `Are you sure you want to ${
        category.active ? 'disable' : 'activate'
      } this category`,
      async () => {
        this.loadingSpinner.show();
        await this.update(categoryToBeUpdated.id || '', categoryToBeUpdated, [])
          .then(() => {
            this.loadingSpinner.hide();
            callback();
          })
          .catch(() => {
            this.loadingSpinner.hide();
          });
      }
    );
  }
}
