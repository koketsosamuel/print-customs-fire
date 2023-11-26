import { Component, Input } from '@angular/core';
import { ICostBreakdown } from 'src/app/models/cost-breakdown.interface';
import { IPrintingInfo } from 'src/app/models/printing-info.interface';

@Component({
  selector: 'app-summary-view',
  templateUrl: './summary-view.component.html',
  styleUrls: ['./summary-view.component.scss']
})
export class SummaryViewComponent {
  @Input({required: true}) printingInfoArr: IPrintingInfo[] = [];
  @Input({required: true}) costBreakDown!: ICostBreakdown;
}
