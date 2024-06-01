import { Component, Input, OnInit } from '@angular/core';
import { ICostBreakdown } from 'src/app/models/cost-breakdown.interface';
import { IPrintingInfo } from 'src/app/models/printing-info.interface';
import { UtilService } from 'src/app/services/util/util.service';

@Component({
  selector: 'app-summary-view',
  templateUrl: './summary-view.component.html',
  styleUrls: ['./summary-view.component.scss']
})
export class SummaryViewComponent implements OnInit {
  @Input({required: true}) printingInfoArr: IPrintingInfo[] = [];
  @Input({required: true}) costBreakDown!: ICostBreakdown;
  @Input({required: true}) quantities!: Record<string, any>;
  @Input({required: true}) totalQuantity!: number;
  quantitesArr: { name: string, value: string }[] = [];

  constructor(private readonly utilService: UtilService) {}

  ngOnInit(): void {
    this.quantitesArr = this.utilService.generateQuantities(this.quantities);
  }
}
