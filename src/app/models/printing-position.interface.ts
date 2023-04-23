import { IImage } from './product.interface';

export interface IPrintingPosition {
  id?: string;
  name: string;
  description: string;
  shortName: string;
  images?: IImage[] | any[];
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}
