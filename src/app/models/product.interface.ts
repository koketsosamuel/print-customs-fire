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
}

export interface IImage {
  path: string;
  link: string;
}
