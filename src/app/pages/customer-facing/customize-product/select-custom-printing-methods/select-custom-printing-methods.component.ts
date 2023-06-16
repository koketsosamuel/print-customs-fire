import { Component, OnInit, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IPrintingMethod } from 'src/app/models/printing-method.interface';
import { IPrintingPosition } from 'src/app/models/printing-position.interface';
import IProduct from 'src/app/models/product.interface';
import { PrintingMethodsService } from 'src/app/services/printing-methods/printing-methods.service';
import { MethodSelectDialogComponent } from './method-select-dialog/method-select-dialog.component';
import { LoadingSpinnerService } from 'src/app/services/loading-spinner/loading-spinner.service';

@Component({
  selector: 'app-select-custom-printing-methods',
  templateUrl: './select-custom-printing-methods.component.html',
  styleUrls: ['./select-custom-printing-methods.component.scss'],
})
export class SelectCustomPrintingMethodsComponent implements OnInit {
  @Input() product!: IProduct;
  @Input() printingPositions: IPrintingPosition[] = [];
  methods: {
    printingPosition: IPrintingPosition;
    methods: IPrintingMethod[];
    selectedMethod: IPrintingMethod | null;
  }[] = [];

  constructor(
    private readonly printingMethodsService: PrintingMethodsService,
    private readonly dialog: MatDialog,
    private readonly loadingSpinnerService: LoadingSpinnerService
  ) {}

  async ngOnInit() {
    this.loadingSpinnerService.show();
    this.methods = await Promise.all(
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

        return { printingPosition, methods, selectedMethod: null };
      })
    ).finally(() => {
      this.loadingSpinnerService.hide();
    });
  }

  openY(methods: any) {
    console.log(this.methods);

    this.dialog.open(MethodSelectDialogComponent, {
      data: { methods, x: 44 },
      minWidth: '400px',
    });
  }
}
