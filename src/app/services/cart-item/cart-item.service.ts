import { Injectable } from '@angular/core';
import { DbService } from '../db/db.service';
import { ICart, ICartItem } from 'src/app/models/cart.interface';
import {
  ICartItemPrintingInfo,
  IPrintingInfo,
} from 'src/app/models/printing-info.interface';
import { StorageService } from '../storage/storage.service';
import { CartService } from '../cart/cart.service';
import { AlertService } from '../alert/alert.service';
import { ICostBreakdown } from 'src/app/models/cost-breakdown.interface';
import { AngularFireUploadTask } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root',
})
export class CartItemService {
  collection = 'CartItem' as const;
  cart!: ICart | null;

  constructor(
    private readonly db: DbService,
    private readonly storage: StorageService,
    private readonly cartService: CartService,
    private readonly alertService: AlertService
  ) {}

  async createCartItem(
    printingInfoArr: IPrintingInfo[],
    quantities: Record<string, any>,
    totalQuantities: number,
    totalPrice: number,
    productId: string,
    costBreakdown: ICostBreakdown,
    variation: string | undefined = undefined
  ) {
    try {

      this.cart = await this.cartService.getCart();

      // create item
      const cartItem: ICartItem = {
        cartId: this.cart!.id as string,
        totalQuantity: totalQuantities,
        quantities: quantities,
        totalPrice: totalPrice,
        createdAt: new Date(),
        updatedAt: null,
        productId,
        costBreakdown,
        variation
      };

      const savedCart = await this.db.addDocument(this.collection, cartItem);

      // upload artwork
      const PI: ICartItemPrintingInfo[] = await this.uploadCartArtworks(printingInfoArr, savedCart);

      console.log(PI);
      

      await this.db.updateById(this.collection, savedCart.id, {
        printingInfoArr: PI,
      });
      this.alertService.success('Item added to cart successfully!');
    } catch (err) {
      console.error(err)
      this.alertService.error('Error adding item to cart, please try again.');
    }
  }

  uploadCartArtworks(printingInfoArr: IPrintingInfo[], cartItem: ICartItem) {
    return Promise.all(printingInfoArr.map(async pi => {
      const res: string = await this.storage.uploadArtworkJSON(pi.artwork, cartItem.id as string)
      return {
        printingPosition: pi.printingPosition.id as string,
        selectedMethod: pi.selectedMethod?.id as string,
        artwork: res
      }
    }));
  }

  getCartItemById(id: string) {
    return this.db.getDocumentById(this.collection, id);
  }
}
