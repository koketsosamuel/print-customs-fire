import { Component, OnInit } from '@angular/core';
import { AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { IBrand } from 'src/app/models/brand.interface';
import { IPrintingMethod } from 'src/app/models/printing-method.interface';
import { BrandsService } from 'src/app/services/brands/brands.service';
import { LoadingSpinnerService } from 'src/app/services/loading-spinner/loading-spinner.service';
import { PrintingMethodsService } from 'src/app/services/printing-methods/printing-methods.service';
import { UtilService } from 'src/app/services/util/util.service';

@Component({
  selector: 'app-brands-view',
  templateUrl: './brands-view.component.html',
  styleUrls: ['./brands-view.component.scss'],
})
export class BrandsViewComponent implements OnInit {
  displayedColumns: string[] = ['Name', 'Image', 'Action'];
  brands: IBrand[] = [];
  sortBy: string = 'name';
  ascending: boolean = true;
  filter: any = {
    active: null,
  };
  after: string | null = null;
  perpage: number = 20;
  afterDoc!: AngularFirestoreDocument;
  hasNext: boolean = false;
  params: any = {};

  constructor(
    public readonly utilService: UtilService,
    private readonly router: Router,
    private readonly brandsService: BrandsService,
    private readonly route: ActivatedRoute,
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
        const afterDoc = this.brandsService.getBrandById(this.after);
        afterDoc.then(async (d: any) => {
          await this.getPrintingMethods(d.doc);
          this.loadingSpinner.hide();
        });
      } else {
        await this.getPrintingMethods();
        this.loadingSpinner.hide();
      }
    });
  }

  goPrev() {
    window.history.back();
  }

  async hasNextPage() {
    if (this.brands.length < this.perpage) {
      this.hasNext = false;
    } else {
      const afterDoc = this.brandsService.getBrandById(this.after || '');
      afterDoc.then(async (d: any) => {
        this.afterDoc = d.doc;
        const res = await this.brandsService.getBrands(
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

  async getPrintingMethods(after: any = null) {
    this.brands = await this.brandsService.getBrands(
      this.sortBy,
      this.ascending,
      this.filter.active ? [['active', '==', this.filter.active]] : [],
      this.perpage,
      after
    );

    this.after = this.brands.length
      ? this.brands[this.brands.length - 1]?.id || null
      : null;

    this.hasNextPage();
  }

  async paginate(reset = true) {
    this.router.navigate(['/admin/brands/view'], {
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
}
