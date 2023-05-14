import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { MatSelectionListChange } from '@angular/material/list';
import { IBrand } from 'src/app/models/brand.interface';
import ICategory from 'src/app/models/category.interface';
import { IFilter } from 'src/app/models/filter.interface';
import { IPrintingMethod } from 'src/app/models/printing-method.interface';
import ISubCategory from 'src/app/models/sub-category.interface';
import { BrandsService } from 'src/app/services/brands/brands.service';
import { CategoryService } from 'src/app/services/category/category.service';
import { LoadingSpinnerService } from 'src/app/services/loading-spinner/loading-spinner.service';
import { PrintingMethodsService } from 'src/app/services/printing-methods/printing-methods.service';
import { SubCategoryService } from 'src/app/services/sub-category/sub-category.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent implements OnInit {
  categories: ICategory[] = [];
  @Input() filter: IFilter = {
    categories: [],
    minPrice: 0,
    maxPrice: 0,
    subCategories: [],
    brands: [],
    printingMethods: [],
  };
  subCategoryGroups: any[] = [];
  subsLoading = false;
  brands: IBrand[] = [];
  printingMethods: IPrintingMethod[] = [];

  @Output() change = new EventEmitter<IFilter>();

  constructor(
    private readonly categoryService: CategoryService,
    private readonly loadingSpinnerService: LoadingSpinnerService,
    private readonly subCategoryService: SubCategoryService,
    private readonly brandsService: BrandsService,
    private readonly printingMethodsService: PrintingMethodsService
  ) {}

  async ngOnInit() {
    this.loadingSpinnerService.show();
    this.categories = await this.categoryService.getCategories('name', true, [
      ['active', '==', true],
    ]);
    this.brands = await this.brandsService.getBrands();
    this.printingMethods = await this.printingMethodsService.getPrintingMethods(
      'name',
      true,
      [['active', '==', true]]
    );
    this.loadingSpinnerService.hide();
  }

  selectedCategories(catIds: MatSelectionListChange) {
    this.filter.categories;
    this.getSubGroups();
  }

  async getSubGroups() {
    this.subsLoading = true;
    let allSubCategories: string[] = [];
    this.subCategoryGroups = [];
    this.subCategoryGroups = await this.subCategoryService.getSubCategoryGroups(
      this.filter.categories
    );
    this.subCategoryGroups = this.subCategoryGroups.map((sg: any) => {
      sg.category = this.categories.filter((c) => c.id === sg.category)[0];

      // get all subs
      allSubCategories = [
        ...allSubCategories,
        ...sg.subCategories.map((sc: ISubCategory) => sc.id),
      ];
      return sg;
    });

    // remove sub categories of deselected categories
    this.filter.subCategories = this.filter.subCategories.filter((id: string) =>
      allSubCategories.includes(id)
    );

    this.subsLoading = false;
  }

  applyFilters() {
    this.change.emit(this.filter);
  }
}
