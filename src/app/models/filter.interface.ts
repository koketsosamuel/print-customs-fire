import { ISort } from './sort.interface';

export interface IFilter {
  categories: string[];
  minPrice: number;
  maxPrice: number;
  subCategories: string[];
  brands: string[];
  printingMethods: string[];
  sort: ISort;
}
