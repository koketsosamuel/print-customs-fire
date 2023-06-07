import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { WhereFilterOp } from '@angular/fire/firestore';
import { MatSelectionListChange } from '@angular/material/list';
import { ActivatedRoute, Router } from '@angular/router';
import { IBrand } from 'src/app/models/brand.interface';
import ICategory from 'src/app/models/category.interface';
import { IFilterComponentOutput } from 'src/app/models/filter-component-output.interface';
import { IFilter } from 'src/app/models/filter.interface';
import { IPrintingMethod } from 'src/app/models/printing-method.interface';
import { ISort } from 'src/app/models/sort.interface';
import ISubCategory from 'src/app/models/sub-category.interface';
import { BrandsService } from 'src/app/services/brands/brands.service';
import { CategoryService } from 'src/app/services/category/category.service';
import { LoadingSpinnerService } from 'src/app/services/loading-spinner/loading-spinner.service';
import { PrintingMethodsService } from 'src/app/services/printing-methods/printing-methods.service';
import { ProductService } from 'src/app/services/product/product.service';
import { SubCategoryService } from 'src/app/services/sub-category/sub-category.service';
import { UtilService } from 'src/app/services/util/util.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent implements OnInit {
  categories: ICategory[] = [];
  sortOptions: ISort[] = [
    { name: 'Cheapest', value: { field: 'price', ascending: true } },
    { name: 'Most Expensive', value: { field: 'price', ascending: false } },
  ];

  priceRanges: any[] = [
    {
      name: 'From R0 to R100',
      values: {
        minPrice: 0,
        maxPrice: 100,
      },
    },
    {
      name: 'From R100 to R500',
      values: {
        minPrice: 100,
        maxPrice: 500,
      },
    },
    {
      name: 'From R500 to R1000',
      values: {
        minPrice: 500,
        maxPrice: 1000,
      },
    },
    {
      name: 'From R1000',
      values: {
        minPrice: 1000,
        maxPrice: 0,
      },
    },
  ];

  selectedPriceRange: string[] = [];

  filterUnUsed: IFilter = {
    category: null,
    minPrice: 0,
    maxPrice: 0,
    subCategory: null,
    brand: null,
    printingMethod: null,
    sort: null,
  };

  filter: any = {
    category: [],
    minPrice: 0,
    maxPrice: 0,
    subCategory: [],
    brand: [],
    sort: null,
  };
  subCategories: any[] = [];
  subsLoading = false;
  brands: IBrand[] = [];
  printingMethods: IPrintingMethod[] = [];
  hasBeenEmitted = false;

  @Output() change = new EventEmitter<IFilterComponentOutput>();

  constructor(
    private readonly categoryService: CategoryService,
    private readonly loadingSpinnerService: LoadingSpinnerService,
    private readonly subCategoryService: SubCategoryService,
    private readonly brandsService: BrandsService,
    private readonly printingMethodsService: PrintingMethodsService,
    private readonly productService: ProductService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly utilService: UtilService
  ) {}

  async ngOnInit() {
    await this.initialLoad();
    this.route.queryParams.subscribe((queryParams: any) => {
      this.setFilterFromParams(queryParams);
      this.triggerChange();
    });
    if (this.filter.category.length > 0) {
      this.getSubs();
    }
    if (!this.filter.sort) {
      this.filter.sort = this.sortOptions[0];
    }
  }

  selectedCategories() {
    this.getSubs();
    this.filter.subCategory = [];
  }

  async getSubs() {
    this.subsLoading = true;
    this.subCategories = await this.subCategoryService.getSubCategories(
      'name',
      true,
      this.filter.category[0]
    );

    this.subsLoading = false;
  }

  applyFilters() {
    this.router.navigate([], {
      queryParams: {
        ...this.utilService.replaceArrayValues(this.filter),
        sort: this.filter.sort?.name || null,
      },
    });
  }

  setSort(sort: ISort) {
    this.filter.sort = sort;
  }

  triggerChange() {
    this.change.emit({
      where: this.productService.generateFirebaseWhereClause(
        this.replaceArrayValues(this.filter)
      ),
      sort: this.filter.sort,
    });
    this.hasBeenEmitted = true;
  }

  async initialLoad() {
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

  setFilterFromParams(params: any) {
    ['category', 'subCategory', 'brand', 'printingMethod'].forEach(
      (key: string) => {
        this.filter[key] = params?.[key] ? [params?.[key]] : [];
      }
    );

    ['minPrice', 'maxPrice'].forEach((key: string) => {
      this.filter[key] = Number(params?.[key] || 0);
      const range = this.priceRanges.find(
        (r) => r.values[key] == params?.[key] && params?.[key] != 0
      );
      if (range?.name) {
        this.selectedPriceRange = range?.name ? [range.name] : [];
      }
    });

    if (params.sort) {
      this.filter.sort = this.sortOptions.find((s) => s.name == params.sort);
    } else {
      this.filter.sort = this.sortOptions[0];
    }
  }

  selectPriceRange() {
    const range = this.priceRanges.find(
      (r) => r.name == this.selectedPriceRange?.[0]
    );

    this.filter.maxPrice = range?.values?.maxPrice || 0;
    this.filter.minPrice = range?.values?.minPrice || 0;
  }

  replaceArrayValues(_obj: any) {
    const obj = { ..._obj };
    for (const key in obj) {
      if (Array.isArray(obj[key])) {
        obj[key] = obj[key][0];
      }
    }
    return obj;
  }

  clearFilter(e: Event, column: string) {
    e.stopPropagation();
    const arrayColumns = ['category', 'subCategory', 'brand', 'printingMethod'];
    const priceColumns = ['selectedPriceRange'];

    if (arrayColumns.includes(column)) {
      this.filter[column] = [];
    } else if (priceColumns.includes(column)) {
      this.selectedPriceRange = [];
      this.filter.minPrice = 0;
      this.filter.maxPrice = 0;
    }

    if (column === 'category') {
      this.filter.subCategory = [];
      this.subCategories = [];
    }
  }
}
