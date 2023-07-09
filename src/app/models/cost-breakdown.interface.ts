export interface ICostBreakdown {
  productCostPerUnit: number;
  totalProductBaseCost: number;
  brandingCosts: {
    locationCosts: { location: string; costPerUnit: number; total: number }[];
    totalCost: number;
  };
  totalCost: number;
  quantity: number;
}
