import { IVariation } from './variation.interface';

export default interface IProduct {
  id?: string;
  name: string;
  description: string;
  price: number;
  promotion: string;
  createdAt: Date;
  updatedAt: Date;
  categories: string[];
  subCategories: string[];
  images?: IImage[];
  keywords: string[];
  variations: IVariation;
  printingPositions: string[];
  printingMethods: Record<string, string[]>;
  printingMethodsSearchableArr: string[];
  searchTerms: string[];
  brand: string;
  active: boolean;
  unitsSold: number;
  rank: number;
}

export interface IImage {
  path: string;
  link: string;
}
