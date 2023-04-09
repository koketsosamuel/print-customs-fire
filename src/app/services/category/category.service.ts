import { Injectable } from '@angular/core';
import { AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { WhereFilterOp } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import ICategory from 'src/app/models/category.interface';
import { AlertService } from '../alert/alert.service';
import { ConfirmDialogueService } from '../confirm-dialogue/confirm-dialogue.service';
import { DbService } from '../db/db.service';
import { LoadingSpinnerService } from '../loading-spinner/loading-spinner.service';

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
    private readonly alert: AlertService
  ) {}

  addCategory(category: ICategory) {
    this.loadingSpinner.show();
    return this.db
      .addDocument(this.COLLECTION_NAME, category)
      .then(() => {
        this.alert.success('Category saved!');
        this.router.navigate(['/category/view']);
      })
      .catch(() => {
        this.alert.error('Error saving category, please retry!');
      })
      .finally(() => {
        this.loadingSpinner.hide();
      });
  }

  async getCategories(
    sortBy = 'name',
    asc = true,
    where: [string, WhereFilterOp, any][] = [],
    limit: number | null = 20,
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

  update(id: string, category: ICategory) {
    delete category.id;
    category.updatedAt = new Date();
    return this.db
      .updateById(this.COLLECTION_NAME, id, category)
      .then(() => {
        this.alert.success('Category has been updated');
      })
      .catch(() => {
        this.alert.error('Error updating category');
      });
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
        await this.update(categoryToBeUpdated.id || '', categoryToBeUpdated)
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
