export interface IVariation {
  name: string;
  options: IVariationOption[];
  subVariations?: ISubVariation;
}

export interface IVariationOption {
  name: string;
  additionalCost: number;
  optionColor: string | null;
}

export interface ISubVariation {
  name: string;
  options: IVariationOption[];
}
