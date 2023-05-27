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
  selector: 'app-products-view',
  templateUrl: './products-view.component.html',
  styleUrls: ['./products-view.component.scss'],
})
export class ProductsViewComponent {
  displayedColumns: string[] = [
    'Name',
    'Categories',
    'Image',
    'Status',
    'Price',
    'Action',
  ];
  products: IProduct[] = [];
  sortBy: string = 'name';
  ascending: boolean = true;
  after: string | null = null;
  perpage: number = 20;
  afterDoc!: AngularFirestoreDocument;
  hasNext: boolean = false;
  params: any = {};
  categories: ICategory[] = [];

  constructor(
    public readonly utilService: UtilService,
    private readonly router: Router,
    private readonly productsService: ProductService,
    private readonly route: ActivatedRoute,
    private readonly loadingSpinner: LoadingSpinnerService,
    private readonly categoriesService: CategoryService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(async (params: any) => {
      this.params = params;
      this.loadingSpinner.show();
      this.sortBy = params.sortBy || this.sortBy;
      this.perpage = params.perpage || this.perpage;

      this.ascending =
        params.ascending === 'false' ? false : true || this.ascending;
      this.after = params.after || null;

      // get categories
      this.categories = await this.categoriesService.getCategories();
      this.loadingSpinner.hide();
    });
  }

  goPrev() {
    window.history.back();
  }

  async hasNextPage() {
    if (this.products.length < this.perpage) {
      this.hasNext = false;
    } else {
      const afterDoc = this.productsService.getProduct(this.after || '');
      afterDoc.then(async (d: any) => {
        this.afterDoc = d.doc;
        const res = await this.productsService.getProducts(
          this.sortBy,
          this.ascending,
          [],
          this.perpage,
          this.afterDoc
        );
        this.hasNext = !!res.length;
      });
    }
  }

  async getProducts(filterAndSort: IFilterComponentOutput) {
    this.products = await this.productsService.getProducts(
      filterAndSort.sort?.value.field || '',
      !!filterAndSort.sort?.value.ascending,
      filterAndSort.where,
      this.perpage
    );

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
        perpage: this.perpage,
        sortBy: this.sortBy,
        ascending: this.ascending,
        after: reset ? null : this.after,
        r: Math.ceil(Math.random() * 222),
      },
    });
    this.hasNext = false;
  }
}
