import { Injectable } from '@angular/core';
import { DbService } from '../db/db.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  collection = 'Order' as const;

  constructor(
    private readonly db: DbService
  ) { }

  async createOrder(order: any) {
    return await this.db.addDocument(this.collection, order).then((res) => {
      return res;
    });
  }
}
