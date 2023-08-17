export interface IVariation {
  name: string;
  options: IVariationOption[];

}

export interface IVariationOption {
  id: string;
  name: string;
  additionalCost: number;
  optionColor: string | null;
  imagePath: string | null;
  quantityAvailable: number;
  subVariations?: ISubVariation;
}

export interface ISubVariation {
  name: string;
  options: IVariationOption[];
}
