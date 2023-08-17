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
      await this.uploadCartArtworks(printingInfoArr, savedCart);

      // attach images (map printinginfo)
      const cartPrintingInfoArr: ICartItemPrintingInfo[] = printingInfoArr.map(
        (pi) => ({
          printingPosition: pi.printingPosition.id as string,
          selectedMethod: pi.selectedMethod?.id as string,
          artwork: {
            image: this.storage.getFileName(
              { name: 'CartItem', id: savedCart.id },
              this.collection,
              pi.artwork?.image as Blob,
              true
            ),
            mockup: pi.artwork?.mockup,
          },
        })
      );

      await this.db.updateById(this.collection, savedCart.id, {
        printingInfoArr: cartPrintingInfoArr,
      });
      this.alertService.success('Item added to cart successfully!');
    } catch (err) {
      console.error(err);
      
      this.alertService.error('Error add item to cart, please try again.');
    }
  }

  uploadCartArtworks(printingInfoArr: IPrintingInfo[], cartItem: ICartItem) {
    return this.storage.uploadImages(
      printingInfoArr.map((pi) => pi.artwork?.image),
      { name: 'cart', id: cartItem?.id || '' },
      this.collection,
      true
    );
  }
}
