import { Component, OnInit } from '@angular/core';
import { AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import ICategory from 'src/app/models/category.interface';
import { CategoryService } from 'src/app/services/category/category.service';
import { ConfirmDialogueService } from 'src/app/services/confirm-dialogue/confirm-dialogue.service';
import { LoadingSpinnerService } from 'src/app/services/loading-spinner/loading-spinner.service';
import { UtilService } from 'src/app/services/util/util.service';

@Component({
  selector: 'app-view-categories',
  templateUrl: './view-categories.component.html',
  styleUrls: ['./view-categories.component.scss'],
})
export class ViewCategoriesComponent implements OnInit {
  displayedColumns: string[] = [
    'ID',
    'Name',
    'Description',
    'Status',
    'Image',
    'Created At',
    'Updated At',
    'Action',
  ];
  categories: ICategory[] = [];
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

  constructor(
    private readonly categorySrevice: CategoryService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    public readonly utilService: UtilService,
    private readonly loadingSpinner: LoadingSpinnerService
  ) {}
  ngOnInit() {
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
        const afterDoc = this.categorySrevice.getCategoryById(this.after);
        afterDoc.then(async (d: any) => {
          await this.getCategories(d.doc);
          this.loadingSpinner.hide();
        });
      } else {
        await this.getCategories();
        this.loadingSpinner.hide();
      }
    });
  }

  async getCategories(after: any = null) {
    this.categories = await this.categorySrevice.getCategories(
      this.sortBy,
      this.ascending,
      this.filter.active ? [['active', '==', this.filter.active]] : [],
      this.perpage,
      after
    );

    this.after = this.categories.length
      ? this.categories[this.categories.length - 1]?.id || null
      : null;

    this.hasNextPage();
  }

  async paginate(reset = true) {
    this.router.navigate(['/category/view'], {
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
    if (this.categories.length < this.perpage) {
      this.hasNext = false;
    } else {
      const afterDoc = this.categorySrevice.getCategoryById(this.after || '');
      afterDoc.then(async (d: any) => {
        this.afterDoc = d.doc;
        const res = await this.categorySrevice.getCategories(
          this.sortBy,
          this.ascending,
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

  toggleStatus(category: ICategory) {
    this.categorySrevice.toggleStatus(category, () => {
      this.paginate();
    });
  }
}
