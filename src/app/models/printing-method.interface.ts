import { IImage } from './product.interface';

export interface IPrintingMethod {
  id?: string;
  name: string;
  shortName: string;
  description: string;
  costPerSquareInch: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  images: IImage[];
}
