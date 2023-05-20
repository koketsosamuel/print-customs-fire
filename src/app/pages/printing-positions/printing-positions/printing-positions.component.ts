import { Component, OnInit } from '@angular/core';
import { AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { IPrintingPosition } from 'src/app/models/printing-position.interface';
import { LoadingSpinnerService } from 'src/app/services/loading-spinner/loading-spinner.service';
import { PrintingPositionsService } from 'src/app/services/printing-positions/printing-positions.service';
import { UtilService } from 'src/app/services/util/util.service';

@Component({
  selector: 'app-printing-positions',
  templateUrl: './printing-positions.component.html',
  styleUrls: ['./printing-positions.component.scss'],
})
export class PrintingPositionsComponent implements OnInit {
  displayedColumns: string[] = [
    'ID',
    'Name',
    'Short Name',
    'Description',
    'Image',
    'Created At',
    'Updated At',
    'Action',
  ];
  printingPositions: IPrintingPosition[] = [];
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
    private readonly printingPositionsService: PrintingPositionsService,
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
        const afterDoc = this.printingPositionsService.getPrintingPosition(
          this.after
        );
        afterDoc.then(async (d: any) => {
          await this.getPrintingPositions(d.doc);
          this.loadingSpinner.hide();
        });
      } else {
        await this.getPrintingPositions();
        this.loadingSpinner.hide();
      }
    });
  }

  async paginate(reset = true) {
    this.router.navigate(['/admin/printing-positions/view'], {
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

  goPrev() {
    window.history.back();
  }

  async hasNextPage() {
    if (this.printingPositions.length < this.perpage) {
      this.hasNext = false;
    } else {
      const afterDoc = this.printingPositionsService.getPrintingPosition(
        this.after || ''
      );
      afterDoc.then(async (d: any) => {
        this.afterDoc = d.doc;
        const res = await this.printingPositionsService.getPrintingPositions(
          this.sortBy,
          this.ascending,
          this.filter.active ? [] : [],
          1,
          this.afterDoc
        );
        this.hasNext = !!res.length;
      });
    }
  }

  async getPrintingPositions(after: any = null) {
    this.printingPositions =
      await this.printingPositionsService.getPrintingPositions(
        this.sortBy,
        this.ascending,
        this.filter.active ? [['active', '==', this.filter.active]] : [],
        this.perpage,
        after
      );

    this.after = this.printingPositions.length
      ? this.printingPositions[this.printingPositions.length - 1]?.id || null
      : null;

    this.hasNextPage();
  }
}
