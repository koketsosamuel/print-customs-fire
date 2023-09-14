import { Component } from '@angular/core';
import { AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import ICategory from 'src/app/models/category.interface';
import { IFilterComponentOutput } from 'src/app/models/filter-component-output.interface';
import IProduct from 'src/app/models/product.interface';
import { CategoryService } from 'src/app/services/category/category.service';
import { LoadingSpinnerService } from 'src/app/services/loading-spinner/loading-spinner.service';
import { ProductService } from 'src/app/services/product/product.service';
import { UtilService } from 'src/app/services/util/util.service';

@Component({
  selector: 'app-product-catalogue',
  templateUrl: './product-catalogue.component.html',
  styleUrls: ['./product-catalogue.component.scss'],
})
export class ProductCatalogueComponent {
  products: IProduct[] = [];
  ascending: boolean = true;
  after: string | null = null;
  perpage: number = 12;
  afterDoc: AngularFirestoreDocument | null = null;
  hasNext: boolean = false;
  params: any = {};
  categories: ICategory[] = [];
  filterAndSort: IFilterComponentOutput = {
    where: [],
    sort: { name: 'Cheapest', value: { field: 'price', ascending: true } },
  };
  hasNextLoading = false;

  constructor(
    public readonly utilService: UtilService,
    private readonly router: Router,
    private readonly productsService: ProductService,
    private readonly route: ActivatedRoute,
    private readonly loadingSpinner: LoadingSpinnerService,
    private readonly categoriesService: CategoryService
  ) {}

  async ngOnInit() {
    this.route.queryParams.subscribe(async (params: any) => {
      this.params = params;
      this.perpage = params.perpage || this.perpage;
      this.after = params.after || null;
    });

    this.loadingSpinner.show();
    this.categories = await this.categoriesService.getCategories();
    this.loadingSpinner.hide();
  }

  goPrev() {
    window.history.back();
  }

  async hasNextPage() {
    this.afterDoc = null;
    this.hasNextLoading = true;

    if (this.products.length < this.perpage) {
      this.hasNext = false;
      this.hasNextLoading = false;
    } else {
      const afterDoc = this.productsService.getProduct(this.after || '');
      afterDoc.then(async (d: any) => {
        this.afterDoc = d?.doc || null;

        const res = await this.productsService.getProducts(
          this.filterAndSort.sort?.value.field,
          this.filterAndSort.sort?.value.ascending,
          [],
          this.perpage,
          this.afterDoc
        );
        this.hasNext = !!res.length;
        this.hasNextLoading = false;
      });
    }
  }

  async getProducts(filterAndSort: IFilterComponentOutput) {
    this.loadingSpinner.show()
    this.filterAndSort = filterAndSort;
    this.products = await this.productsService.getProducts(
      this.filterAndSort.sort?.value.field || '',
      !!this.filterAndSort.sort?.value.ascending,
      [['active', '==', true], ...this.filterAndSort.where],
      this.perpage,
      this.afterDoc || null
    ).finally(() => {
      this.loadingSpinner.hide();
    });

    this.after = this.products.length
      ? this.products[this.products.length - 1]?.id || null
      : null;

    this.products = this.products.map((p) => {
      p.categories = p.categories.map(
        (c) => this.categories.find((_c) => _c.id === c)?.name || ''
      );
      return p;
    });

    this.hasNextPage();
  }

  async paginate(reset = true) {
    this.router.navigate(['/admin/products/view'], {
      queryParams: {
        ...this.params,
        perpage: this.perpage,
        after: reset ? null : this.after,
        r: Math.ceil(Math.random() * 2322),
      },
    });
    this.hasNext = false;
  }
}
