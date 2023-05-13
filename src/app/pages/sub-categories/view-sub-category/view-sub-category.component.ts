import { Component, OnInit } from '@angular/core';
import { AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Router, ActivatedRoute } from '@angular/router';
import ICategory from 'src/app/models/category.interface';
import ISubCategory from 'src/app/models/sub-category.interface';
import { CategoryService } from 'src/app/services/category/category.service';
import { LoadingSpinnerService } from 'src/app/services/loading-spinner/loading-spinner.service';
import { SubCategoryService } from 'src/app/services/sub-category/sub-category.service';
import { UtilService } from 'src/app/services/util/util.service';

@Component({
  selector: 'app-view-sub-category',
  templateUrl: './view-sub-category.component.html',
  styleUrls: ['./view-sub-category.component.scss'],
})
export class ViewSubCategoryComponent implements OnInit {
  displayedColumns: string[] = [
    'ID',
    'Name',
    'Description',
    'Status',
    'Created At',
    'Updated At',
    'Action',
  ];
  subCategories: ISubCategory[] = [];
  sortBy: string = 'name';
  ascending: boolean = true;
  filter: any = {
    active: null,
  };
  after: string | null = null;
  perpage: number = 10;
  afterDoc!: AngularFirestoreDocument;
  hasNext: boolean = false;
  params: any = {};
  categoryId: string = '';
  category: ICategory = {
    name: '',
    description: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    active: true,
    images: [],
  };

  constructor(
    private readonly subCategoryService: SubCategoryService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    public readonly utilService: UtilService,
    private readonly loadingSpinner: LoadingSpinnerService,
    private readonly categoryService: CategoryService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((paramsData: any) => {
      this.categoryId = paramsData.categoryId;
      this.getCategory();

      this.route.queryParams.subscribe(async (params: any) => {
        this.params = params;

        this.loadingSpinner.show();
        this.sortBy = params.sortBy || this.sortBy;
        this.perpage = params.perpage || this.perpage;
        this.filter.active =
          params.active === 'false'
            ? false
            : params.active === 'true'
            ? true
            : this.filter.active;
        this.ascending =
          params.ascending === 'false' ? false : true || this.ascending;
        this.after = params.after || null;

        if (this.after) {
          const afterDoc = this.subCategoryService.getSubCategoryById(
            this.after
          );
          afterDoc.then(async (d: any) => {
            await this.getSubCategories(d.doc).finally(() => {
              this.loadingSpinner.hide();
            });
          });
        } else {
          await this.getSubCategories().finally(() => {
            this.loadingSpinner.hide();
          });
        }
      });
    });
  }

  async getSubCategories(after: any = null) {
    this.subCategories = await this.subCategoryService.getSubCategories(
      this.sortBy,
      this.ascending,
      this.categoryId,
      this.filter.active ? [['active', '==', this.filter.active]] : [],
      this.perpage,
      after
    );

    this.after = this.subCategories.length
      ? this.subCategories[this.subCategories.length - 1]?.id || null
      : null;

    this.hasNextPage();
  }

  async paginate(reset = true) {
    this.router.navigate(['/sub-category/view', this.categoryId], {
      queryParams: {
        perpage: this.perpage,
        sortBy: this.sortBy,
        active: this.filter.active,
        ascending: this.ascending,
        after: reset ? null : this.after,
        r: Math.ceil(Math.random() * 222),
      },
    });
    this.hasNext = false;
  }

  async hasNextPage() {
    if (this.subCategories.length < this.perpage) {
      this.hasNext = false;
    } else {
      const afterDoc = this.subCategoryService.getSubCategoryById(
        this.after || ''
      );
      afterDoc.then(async (d: any) => {
        this.afterDoc = d.doc;
        const res = await this.subCategoryService.getSubCategories(
          this.sortBy,
          this.ascending,
          this.categoryId,
          this.filter.active ? [['active', '==', this.filter.active]] : [],
          1,
          this.afterDoc
        );
        this.hasNext = !!res.length;
      });
    }
  }

  goPrev() {
    window.history.back();
  }

  toggleStatus(subCategory: ISubCategory) {
    this.subCategoryService.toggleStatus(subCategory, () => {
      this.paginate();
    });
  }

  getCategory() {
    this.categoryService.getCategoryById(this.categoryId).then((cat: any) => {
      this.category = cat.value;
    });
  }
}
