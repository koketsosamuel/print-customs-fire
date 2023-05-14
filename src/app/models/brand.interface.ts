import { IImage } from './product.interface';

export interface IBrand {
  id?: string;
  name: string;
  images: IImage[];
}
