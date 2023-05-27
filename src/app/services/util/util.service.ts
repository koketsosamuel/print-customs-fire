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

  replaceArrayValues(objIn: Record<string, any>) {
    const obj = { ...objIn };
    for (const key in obj) {
      if (Array.isArray(obj[key])) {
        obj[key] = obj[key][0];
      }
    }
    return obj;
  }
}
