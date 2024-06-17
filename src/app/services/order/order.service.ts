import { Injectable } from '@angular/core';
import { DbService } from '../db/db.service';
import { ProductService } from '../product/product.service';
import { ICartItem } from 'src/app/models/cart.interface';
import { PrintingPositionsService } from '../printing-positions/printing-positions.service';
import { PrintingMethodsService } from '../printing-methods/printing-methods.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  orderCollection = 'Order' as const;
  itemsCollection = 'OrderItem' as const;

  constructor(
    private readonly db: DbService,
    private readonly productService: ProductService,
    private readonly printingPositionService: PrintingPositionsService,
    private readonly printingMethodService: PrintingMethodsService
  ) { }

  async createOrder(order: any) {
    const res = await this.db.getDocumentWhereFieldEquals(this.orderCollection, ['cartId', order.cartId]);
    console.log(res);
    
    if (res?.id) {
      return res;
    }

    return this.db.addDocument(this.orderCollection, order).then((res) => {
      return res;
    });
  }

  async getOrderItems(orderId: string) {
    let items = await this.db.getDocumentsOrderedByWhere(
      this.itemsCollection, 'createdAt',
      false, [['orderId', '==', orderId]], null, null
    );
    items = await Promise.all(items.map(async (item: ICartItem) => {
      const product = await this.productService.getProduct(item.productId);
      const printingInfoArr = await Promise.all(item.printingInfoArr!.map(async (pi) => {
        const printingPosition = await this.printingPositionService.getPrintingPosition(pi.printingPosition)
        const selectedMethod = await this.printingMethodService.getPrintingMethod(pi.selectedMethod);
        return { ...pi, printingPosition: printingPosition.value, selectedMethod: selectedMethod.value }
      }));
      return { ...item, product: product.value, printingInfoArr }
    }));
    return items;
  }

  async getOrder(orderId: string) {
    const res: any = await this.db.getDocumentById(this.orderCollection, orderId);
    if (res) {
      let items = await this.getOrderItems(orderId);
      res.value.items = items;
    }
    return res;
  }

  async getOrderByOrderNumber(orderNumber: string) {
    let res: any = await this.db.getDocumentWhereFieldEquals(this.orderCollection, ['orderNumber', orderNumber]);
    console.log(res);
    
    let items = await this.getOrderItems(res.id);
    res.items = items;
    res = { value: res }
    return res;
  }
}
