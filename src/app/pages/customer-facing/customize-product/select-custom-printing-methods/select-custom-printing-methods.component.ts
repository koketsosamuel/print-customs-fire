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
  @Input({ required: true }) product!: IProduct;
  @Input({ required: true }) printingInfo: IPrintingInfo[] = [];
  @Output() change = new EventEmitter<IPrintingInfo[]>();

  validated: boolean = false;

  constructor(private readonly dialog: MatDialog) {}

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
        this.validate();
      });
  }

  savePrintingInfo() {
    this.change.emit(this.printingInfo);
  }

  validate() {
    this.validated = !!!this.printingInfo.find((pi) => !pi.selectedMethod);
  }

  ngOnInit() {
    this.validate();
  }
}
