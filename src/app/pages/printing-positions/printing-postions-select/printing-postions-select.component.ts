import { Component, OnInit, Input, Output } from '@angular/core';
import { IImageCardOption } from 'src/app/models/image-card-option.interface';
import { IPrintingPosition } from 'src/app/models/printing-position.interface';
import IProduct from 'src/app/models/product.interface';
import { LoadingSpinnerService } from 'src/app/services/loading-spinner/loading-spinner.service';
import { PrintingPositionsService } from 'src/app/services/printing-positions/printing-positions.service';

@Component({
  selector: 'app-printing-postions-select',
  templateUrl: './printing-postions-select.component.html',
  styleUrls: ['./printing-postions-select.component.scss'],
})
export class PrintingPostionsSelectComponent implements OnInit {
  @Input() product!: IProduct;
  printingPositions: IPrintingPosition[] = [];
  printingPositionsOptions: IImageCardOption[] = [];

  constructor(
    private readonly printingPositionsService: PrintingPositionsService,
    private readonly loadingSpinner: LoadingSpinnerService
  ) {}

  async ngOnInit() {
    this.loadingSpinner.show();
    this.printingPositions = await this.printingPositionsService
      .getPrintingPositions('name', true, [['active', '==', true]], null, null)
      .finally(() => {
        this.loadingSpinner.hide();
      });

    this.printingPositionsOptions = this.printingPositions.map((pp) => ({
      name: pp.name,
      object: pp,
      imgSrc: pp.images?.[0]?.link,
      selected: this.product?.printingPositions.includes(pp.id || ''),
      value: 'id',
    }));
  }

  updatePositions(values: string[]) {
    this.product.printingPositions = values;
    console.log(this.product);
  }
}
