import { IImage } from './product.interface';

export default interface ICategory {
  id?: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  active: Boolean;
  images: IImage[];
}
