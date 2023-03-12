import { Injectable } from '@angular/core';
import { AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { WhereFilterOp } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import ICategory from 'src/app/models/category.interface';
import ISubCategory from 'src/app/models/sub-category.interface';
import { AlertService } from '../alert/alert.service';
import { ConfirmDialogueService } from '../confirm-dialogue/confirm-dialogue.service';
import { DbService } from '../db/db.service';
import { LoadingSpinnerService } from '../loading-spinner/loading-spinner.service';

@Injectable({
  providedIn: 'root',
})
export class SubCategoryService {
  COLLECTION_NAME = 'SubCategory';

  constructor(
    private db: DbService,
    private readonly router: Router,
    private readonly confirmDialog: ConfirmDialogueService,
    private readonly loadingSpinner: LoadingSpinnerService,
    private readonly alert: AlertService
  ) {}

  addSubCategory(subCategory: ISubCategory) {
    this.loadingSpinner.show();
    return this.db
      .addDocument(this.COLLECTION_NAME, subCategory)
      .then(() => {
        this.alert.success('Sub-Category saved!');
        this.router.navigate(['/sub-category/view', subCategory.category]);
      })
      .catch((err) => {
        this.alert.error('Error saving sub-category, please retry!');
      })
      .finally(() => {
        this.loadingSpinner.hide();
      });
  }

  async getSubCategories(
    sortBy = 'name',
    asc = true,
    categoryId: string,
    where: [string, WhereFilterOp, any][] = [],
    limit = 20,
    after: AngularFirestoreDocument | null = null
  ) {
    return await this.db.getDocumentsOrderedByWhere(
      this.COLLECTION_NAME,
      sortBy,
      asc,
      [['category', '==', categoryId], ...where],
      limit,
      after
    );
  }

  getSubCategoryById(id: string) {
    return this.db.getDocumentById(this.COLLECTION_NAME, id);
  }

  update(id: string, subCategory: ISubCategory) {
    delete subCategory.id;
    subCategory.updatedAt = new Date();
    return this.db
      .updateById(this.COLLECTION_NAME, id, subCategory)
      .then(() => {
        this.alert.success('Sub-Category has been updated');
      })
      .catch((err) => {
        this.alert.error('Error updating sub-category');
      });
  }

  toggleStatus(subCategory: ISubCategory, callback: any = async () => {}) {
    const subCategoryToBeUpdated = { ...subCategory };
    subCategoryToBeUpdated.active = !subCategoryToBeUpdated.active;

    this.confirmDialog.openDialogue(
      `Are you sure you want to ${
        subCategory.active ? 'disable' : 'activate'
      } this sub-category`,
      async () => {
        this.loadingSpinner.show();
        await this.update(
          subCategoryToBeUpdated.id || '',
          subCategoryToBeUpdated
        )
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
