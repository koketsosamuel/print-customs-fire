import { IArtwork } from './artwork.interface';
import { IPrintingMethod } from './printing-method.interface';
import { IPrintingPosition } from './printing-position.interface';

export interface IPrintingInfo {
  printingPosition: IPrintingPosition;
  methods: IPrintingMethod[];
  selectedMethod: IPrintingMethod | null;
  artwork: Record<string, any> | null;
  exportView?: string;
}

export interface ICartItemPrintingInfo {
  printingPosition: string;
  selectedMethod: string;
  artwork: string;
  exportView: string;
}