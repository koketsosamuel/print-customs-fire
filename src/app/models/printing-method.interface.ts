import { IImage } from './product.interface';

export interface IPrintingMethod {
  id?: string;
  name: string;
  shortName: string;
  thinLines: boolean;
  maxNumberOfColors: number;
  minNumberOfColors: number;
  minQuantity: number;
  maxQuantity: number;
  description: string;
  perColorCost: number;
  setupFee: number;
  perQuantityCost: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  images: IImage[];
}
