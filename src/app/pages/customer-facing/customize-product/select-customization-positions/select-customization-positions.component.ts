import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { IImageCardOption } from 'src/app/models/image-card-option.interface';
import { IPrintingInfo } from 'src/app/models/printing-info.interface';
import { IPrintingPosition } from 'src/app/models/printing-position.interface';
import IProduct from 'src/app/models/product.interface';
import { LoadingSpinnerService } from 'src/app/services/loading-spinner/loading-spinner.service';
import { PrintingMethodsService } from 'src/app/services/printing-methods/printing-methods.service';
import { PrintingPositionsService } from 'src/app/services/printing-positions/printing-positions.service';

@Component({
  selector: 'app-select-customization-positions',
  templateUrl: './select-customization-positions.component.html',
  styleUrls: ['./select-customization-positions.component.scss'],
})
export class SelectCustomizationPositionsComponent implements OnInit {
  options: IImageCardOption[] = [];
  @Input() selectedOptions: any[] = [];
  @Input() printingInfo: IPrintingInfo[] = [];
  @Output() positionsChanged = new EventEmitter<IPrintingInfo[]>();
  @Input({ required: true }) product!: IProduct;

  constructor(
    private readonly printingPositionsService: PrintingPositionsService,
    private readonly loadingSpinnerService: LoadingSpinnerService,
    private readonly printingMethodsService: PrintingMethodsService
  ) { }

  ngOnInit() {
    this.loadingSpinnerService.show();
    const promises = Promise.all(
      this.product.printingPositions.map(async (printingLocationId) => {
        const printingLocation = (
          await this.printingPositionsService.getPrintingPosition(
            printingLocationId
          )
        ).value;

        return {
          name: printingLocation.name,
          value: 'printingLocation',
          object: { ...printingLocation, printingLocation },
          imgSrc: printingLocation.images[0].link,
          selected: !!this.selectedOptions.includes(printingLocation.id),
        };
      })
    );

    promises
      .then((res) => {
        this.options = res;
      })
      .finally(() => {
        this.loadingSpinnerService.hide();
      });
  }

  updatedSelectedPrintingLocations(selected: any) {
    this.selectedOptions = selected;
  }

  goToNextPage() {
    this.updatePrintingInfo(this.selectedOptions)
      .then(info => {
        this.positionsChanged.emit(info);
      });
  }

  async updatePrintingInfo(printingPositions: IPrintingPosition[]) {
    this.loadingSpinnerService.show();

    return await Promise.all(
      printingPositions.map(async (printingPosition) => {

        const methods = await Promise.all(
          this.product.printingMethods[printingPosition.id || ''].map(
            async (methodId) => {
              return (
                await this.printingMethodsService.getPrintingMethod(methodId)
              ).value;
            }
          )
        );

        return {
          printingPosition,
          methods,
          selectedMethod: null,
          artwork: null,
        };
      })
    ).finally(() => {
      this.loadingSpinnerService.hide();
    });

  }
}
