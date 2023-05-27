import { WhereFilterOp } from '@angular/fire/firestore';
import { ISort } from './sort.interface';

export interface IFilterComponentOutput {
  where: [string, WhereFilterOp, any][];
  sort: ISort | null;
}
