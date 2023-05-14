import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import IProduct from 'src/app/models/product.interface';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipEditedEvent, MatChipInputEvent } from '@angular/material/chips';
import ICategory from 'src/app/models/category.interface';
import { IBrand } from 'src/app/models/brand.interface';
import { BrandsService } from 'src/app/services/brands/brands.service';
import { LoadingSpinnerService } from 'src/app/services/loading-spinner/loading-spinner.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
})
export class ProductFormComponent implements OnInit {
  @Input() edit = false;
  @Output() submitProductEvent = new EventEmitter<IProduct>();
  @Input() product!: IProduct;
  keywords: string = '';
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  @Input() categories: ICategory[] = [];
  @Input() subCategoryGroups: any[] = [];
  @Output() getSubCategories = new EventEmitter<any>();
  brands: IBrand[] = [];

  constructor(
    private readonly brandsService: BrandsService,
    private readonly loadingSpinnerService: LoadingSpinnerService
  ) {}

  async ngOnInit() {
    this.loadingSpinnerService.show();
    this.brands = await this.brandsService.getBrands();
    this.loadingSpinnerService.hide();
  }

  selectionClosed() {
    this.getSubCategories.emit({});
  }

  getObjectsFromIds(ids: string[], objects: any[]) {
    return objects.filter((object) => ids.includes(object.id || ''));
  }

  submitProduct() {
    this.submitProductEvent.emit(this.product);
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.product.keywords.push(value);
    }
    event.chipInput!.clear();
  }

  remove(keyword: string) {
    const index = this.product.keywords.indexOf(keyword);

    if (index >= 0) {
      this.product.keywords.splice(index, 1);
    }
  }

  editKeywords(keyword: string, event: MatChipEditedEvent) {
    const value = event.value.trim();
    if (!value) {
      this.remove(keyword);
      return;
    }
    const index = this.product.keywords.indexOf(keyword);
    if (index >= 0) {
      this.product.keywords[index] = value;
    }
  }
}
