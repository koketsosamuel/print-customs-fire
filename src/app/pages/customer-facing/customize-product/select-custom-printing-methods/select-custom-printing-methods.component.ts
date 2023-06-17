import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IPrintingMethod } from 'src/app/models/printing-method.interface';
import { IPrintingPosition } from 'src/app/models/printing-position.interface';
import IProduct from 'src/app/models/product.interface';
import { PrintingMethodsService } from 'src/app/services/printing-methods/printing-methods.service';
import { MethodSelectDialogComponent } from './method-select-dialog/method-select-dialog.component';
import { LoadingSpinnerService } from 'src/app/services/loading-spinner/loading-spinner.service';
import { IPrintingInfo } from 'src/app/models/printing-info.interface';

@Component({
  selector: 'app-select-custom-printing-methods',
  templateUrl: './select-custom-printing-methods.component.html',
  styleUrls: ['./select-custom-printing-methods.component.scss'],
})
export class SelectCustomPrintingMethodsComponent implements OnInit {
  @Input() product!: IProduct;
  @Input() printingPositions: IPrintingPosition[] = [];
  printingInfo: IPrintingInfo[] = [];
  @Output() change = new EventEmitter<IPrintingInfo[]>();

  constructor(
    private readonly printingMethodsService: PrintingMethodsService,
    private readonly dialog: MatDialog,
    private readonly loadingSpinnerService: LoadingSpinnerService
  ) {}

  async ngOnInit() {
    this.loadingSpinnerService.show();
    this.printingInfo = await Promise.all(
      this.printingPositions.map(async (printingPosition) => {
        console.log(this.product);

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
          artWork: null,
        };
      })
    ).finally(() => {
      this.loadingSpinnerService.hide();
    });
  }

  chooseMethod(printingInfo: any) {
    this.dialog
      .open(MethodSelectDialogComponent, {
        data: { printingInfo },
        minWidth: '400px',
      })
      .afterClosed()
      .subscribe((data) => {
        printingInfo.selectedMethod =
          data?.length > 0 ? data[0] : printingInfo.selectedMethod;
      });
  }

  savePrintingInfo() {
    this.change.emit(this.printingInfo);
  }
}
