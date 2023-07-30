import { ICanvasPositionInfo } from './canvas-position-info.interface';
import { IImage } from './product.interface';

export interface IPrintingPosition {
  id?: string;
  name: string;
  description: string;
  shortName: string;
  images?: IImage[] | any[];
  areaInSquareInches: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  canvasPositionInfo: ICanvasPositionInfo;
  ppi: number;
}
