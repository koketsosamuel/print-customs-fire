import { Injectable } from '@angular/core';
import IProduct from 'src/app/models/product.interface';
import { AlertService } from '../alert/alert.service';
import { DbService } from '../db/db.service';
import { LoadingSpinnerService } from '../loading-spinner/loading-spinner.service';
import { StorageService } from '../storage/storage.service';
import { AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { WhereFilterOp } from '@angular/fire/firestore';
import { IFilter } from 'src/app/models/filter.interface';

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
    if (product.printingMethods) {
      product.printingMethodsSearchableArr = this.getAllPrintingMethods(
        product.printingMethods
      );
    }
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

  private getAllPrintingMethods(
    printingMethodsPerLocation: Record<string, string[]>
  ) {
    let arr: string[] = [];
    Object.values(printingMethodsPerLocation).forEach((v) => {
      v.forEach((m) => {
        if (!arr.includes(m)) {
          arr.push(m);
        }
      });
    });
    return arr;
  }

  getSearchTerms(name: string, keywords: string[]) {
    //abcdef
    const words = [name, ...keywords];
    let len = words.length;
    for (let i = 0; i < name.length; i++) {
      for (let j = i; j < name.length; j++) {
        if (len + j <= name.length) {
          words.push(name.substring(j, len + j));
        }
      }
      len--;
    }
    return words;
  }

  getProducts(
    sortBy: string = 'price',
    asc = false,
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

  generateFirebaseWhereClause(filter: IFilter): [string, WhereFilterOp, any][] {
    const whereClause: [string, WhereFilterOp, any][] = [];

    if (!filter.subCategory && filter.category) {
      whereClause.push(['categories', 'array-contains', filter.category]);
    } else if (filter.subCategory) {
      whereClause.push(['subCategories', 'array-contains', filter.subCategory]);
    }

    if (filter.minPrice !== undefined && filter.minPrice > 0) {
      whereClause.push(['price', '>=', filter.minPrice]);
    }

    if (filter.maxPrice !== undefined && filter.maxPrice > filter.minPrice) {
      whereClause.push(['price', '<=', filter.maxPrice]);
    }

    if (filter.brand) {
      whereClause.push(['brand', '==', filter.brand]);
    }

    return whereClause;
  }
}
