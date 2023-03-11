import { Injectable } from '@angular/core';
import * as moment from 'moment';
@Injectable({
  providedIn: 'root',
})
export class UtilService {
  constructor() {}

  formatDate(date: Date, format: string) {
    return moment(new Date(date)).format(format);
  }
}
