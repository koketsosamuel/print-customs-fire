import { Component, Input, OnInit } from '@angular/core';
import { IPrintingMethod } from 'src/app/models/printing-method.interface';
import { PrintingMethodsService } from 'src/app/services/printing-methods/printing-methods.service';

@Component({
  selector: 'app-printing-methods-chips',
  templateUrl: './printing-methods-chips.component.html',
  styleUrls: ['./printing-methods-chips.component.scss'],
})
export class PrintingMethodsChipsComponent implements OnInit {
  @Input() printingMethodIds: string[] = [];
  printingMethodsAvailable: IPrintingMethod[] = [];
  printingMethods: IPrintingMethod[] = [];
  loading = false;

  constructor(
    private readonly printingMethodsService: PrintingMethodsService
  ) {}

  async ngOnInit() {
    this.loading = true;
    this.printingMethodsAvailable =
      await this.printingMethodsService.getPrintingMethods('name', true, [
        ['active', '==', true],
      ]);
    this.loading = false;
  }
}
