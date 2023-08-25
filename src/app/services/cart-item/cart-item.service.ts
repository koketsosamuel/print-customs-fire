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

      const PI: ICartItemPrintingInfo[] = await this.uploadCartArtworks(printingInfoArr, savedCart.id);

      await this.db.updateById(this.collection, savedCart.id, {
        printingInfoArr: PI,
      });
      this.alertService.success('Item added to cart successfully!');
    } catch (err) {
      console.error(err)
      this.alertService.error('Error adding item to cart, please try again.');
    }
  }

  async updateCartItem(
    cartItem: ICartItem,
    printingInfoArr: IPrintingInfo[],
    quantities: Record<string, any>,
    totalQuantities: number,
    totalPrice: number,
    productId: string,
    costBreakdown: ICostBreakdown,
    printingInfoChanged: boolean = false,
    variation: string | undefined = undefined
  ) {
    try {

      const cartItemId = cartItem.id as string;

      // create item
      const newCartItem: ICartItem | any = {
        totalQuantity: totalQuantities,
        quantities: quantities,
        totalPrice: totalPrice,
        updatedAt: new Date(),
        productId,
        costBreakdown,
        variation
      };

      if (printingInfoChanged) {
        const printingInfo: ICartItemPrintingInfo[] = await this.uploadCartArtworks(printingInfoArr, cartItemId);
        newCartItem.printingInfoArr = printingInfo;
      }      

      const updatedCart = await this.db.updateById(this.collection, cartItemId, newCartItem);

      if (printingInfoChanged) {
        this.alertService.success('Item updated successfully!');
        await this.storage.removeFiles(cartItem.printingInfoArr!.map(pi => pi.artwork), 'artwork');
        this.alertService.success('Old artwork removed!');
      }
      
      
    } catch (err) {
      console.error(err)
      this.alertService.error('Error updating item, please try again.');
    }
  }

  uploadCartArtworks(printingInfoArr: IPrintingInfo[], cartItemId: string) {
    return Promise.all(printingInfoArr.map(async pi => {
      const res: string = await this.storage.uploadArtworkJSON(pi.artwork, cartItemId as string)
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

  getCartItemsForCart(cartId: string) {
    return this.db.getDocumentsOrderedByWhere(this.collection, 'createdAt', true, [['cartId', '==', cartId]])
  }
}
