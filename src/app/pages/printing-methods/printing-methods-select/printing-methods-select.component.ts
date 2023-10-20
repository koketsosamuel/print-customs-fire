import { Component, Input, OnInit } from '@angular/core';
import { IImageCardOption } from 'src/app/models/image-card-option.interface';
import { IPrintingMethod } from 'src/app/models/printing-method.interface';
import { IPrintingPosition } from 'src/app/models/printing-position.interface';
import IProduct from 'src/app/models/product.interface';
import { AlertService } from 'src/app/services/alert/alert.service';
import { LoadingSpinnerService } from 'src/app/services/loading-spinner/loading-spinner.service';
import { PrintingMethodsService } from 'src/app/services/printing-methods/printing-methods.service';
import { PrintingPositionsService } from 'src/app/services/printing-positions/printing-positions.service';
import { ProductService } from 'src/app/services/product/product.service';

@Component({
  selector: 'app-printing-methods-select',
  templateUrl: './printing-methods-select.component.html',
  styleUrls: ['./printing-methods-select.component.scss'],
})
export class PrintingMethodsSelectComponent implements OnInit {
  @Input() product!: IProduct;
  printingPositionsSections: {
    printingPosition: IPrintingPosition;
    printingMethodsOptions: IImageCardOption[];
  }[] = [];
  printingMethods: IPrintingMethod[] = [];

  constructor(
    private readonly printingMethodsService: PrintingMethodsService,
    private readonly printingPositionsService: PrintingPositionsService,
    private readonly loadingSpinnerService: LoadingSpinnerService,
    private readonly productService: ProductService,
    private readonly alertService: AlertService
  ) {}

  async ngOnInit() {
    try {
      this.loadingSpinnerService.show();
      this.printingMethods = await this.printingMethodsService.getPrintingMethods(
        'name',
        true,
        [['active', '==', true]],
        null
      );
  
      this.printingPositionsSections = await Promise.all(
        this.product.printingPositions.map(async (pp) => {
          const printingPosition = (
            await this.printingPositionsService.getPrintingPosition(pp)
          ).value;
          return {
            printingPosition,
            printingMethodsOptions: this.printingMethods.map((pm) => {
              return {
                name: pm.name,
                selected: !!this.product.printingMethods?.[pp]?.includes(
                  pm.id || ''
                ),
                value: 'id',
                object: { ...pm },
                imgSrc: pm.images?.[0]?.link,
              };
            }),
          };
        })
      );
    } catch (error) {
      this.alertService.error('Error loading printing methods, please reload page.')
    } finally {
      this.loadingSpinnerService.hide();
    }
  }

  updateMethods(selections: string[], position: string) {
    if (!this.product.printingMethods) {
      this.product.printingMethods = {};
    }
    this.product.printingMethods[position] = selections;
  }
  saveUpdates() {
    this.loadingSpinnerService.show();
    this.productService
      .update(this.product.id || '', {
        printingMethods: this.product.printingMethods,
      })
      .finally(() => {
        this.loadingSpinnerService.hide();
      });
  }
}
