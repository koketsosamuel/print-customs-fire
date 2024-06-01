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
import { ProductService } from '../product/product.service';
import { PrintingPositionsService } from '../printing-positions/printing-positions.service';
import { PrintingMethodsService } from '../printing-methods/printing-methods.service';

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
    private readonly alertService: AlertService,
    private readonly productService: ProductService,
    private readonly printingPositionService: PrintingPositionsService,
    private readonly printingMethodService: PrintingMethodsService
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
      };

      if (variation) {
        cartItem.variation = variation;
      }

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
      };

      if (variation) {
        newCartItem.variation = variation;
      }
      
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

  uploadCartArtworks(printingInfoArr: IPrintingInfo[], cartItemId: string): Promise<any[]> {
    return Promise.all(printingInfoArr.map(async pi => {
      const res: string = await this.storage.uploadArtworkJSON(pi.artwork, cartItemId as string)
      return {
        printingPosition: pi.printingPosition.id as string,
        selectedMethod: pi.selectedMethod?.id as string,
        artwork: res,
        exportView: pi.exportView
      }
    }));
  }

  getCartItemById(id: string) {
    return this.db.getDocumentById(this.collection, id);
  }

  async getCartItemsForCart(cartId: string) {
    const rawItems = await this.db.getDocumentsOrderedByWhere(this.collection, 'createdAt', true, [['cartId', '==', cartId]]);
    const items: any[] = await Promise.all(rawItems.map(async (item: ICartItem) => {
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

  removeCartItem(cartItemId: string) {
    return this.db.deleteDocument(this.collection, cartItemId).then((value => {
      this.alertService.success('Item removed from cart');
      return value;
    }));
  }
}
