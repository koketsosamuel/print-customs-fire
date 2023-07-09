import { Component, Input } from '@angular/core';
import { ICostBreakdown } from 'src/app/models/cost-breakdown.interface';

@Component({
  selector: 'app-cost-breakdown',
  templateUrl: './cost-breakdown.component.html',
  styleUrls: ['./cost-breakdown.component.scss'],
})
export class CostBreakdownComponent {
  @Input({ required: true }) costBreakdown: ICostBreakdown = {
    productCostPerUnit: 0,
    brandingCosts: {
      locationCosts: [],
      totalCost: 0,
    },
    totalCost: 0,
    quantity: 0,
    totalProductBaseCost: 0,
  };
}
