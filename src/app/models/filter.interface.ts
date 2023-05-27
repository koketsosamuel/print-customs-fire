import { ISort } from './sort.interface';

export interface IFilter {
  category: string | null;
  minPrice: number;
  maxPrice: number;
  subCategory: string | null;
  brand: string | null;
  printingMethod: string | null;
  sort: ISort | null;
}
