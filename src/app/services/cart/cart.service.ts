import { Injectable, Injector } from '@angular/core';
import { DbService } from '../db/db.service';
import { ICart, ICartItem } from 'src/app/models/cart.interface';
import { StorageService } from '../storage/storage.service';
import { AuthService } from '../auth/auth.service';
import { CartItemService } from '../cart-item/cart-item.service';
import { AlertService } from '../alert/alert.service';
import { ProductService } from '../product/product.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  collection = 'Cart' as const;
  cart!: ICart;

  constructor(
    private readonly auth: AuthService,
    private readonly db: DbService,
    private readonly injector: Injector,
    private readonly productService: ProductService
  ) {}

  async getCart() {
    const user: any = await this.auth.getUserId();
    let cart: ICart | null = null;

    cart = await this._getCart(user.uid);

    if (user && user?.uid) {
      if (!cart) {
        cart = await this.createCart(user)
      }
      this.cart = cart as ICart;
    }
    return cart;
  }

  private async _getCart(userId: string) {
    const cart = await this.db.getDocumentWhereFieldEquals(this.collection, [
      'userId',
      userId,
    ]);
    this.cart = cart;
    return cart;
  }

  async getUserCart() {
    const cartService = this.injector.get(CartItemService);
    const user: any = await this.auth.getUserId();
    const cart: ICart = await this._getCart(user.uid);
    cart.cartItems = await cartService.getCartItemsForCart(
      cart.id as string
    );
    cart.cartItems = await Promise.all((cart.cartItems as ICartItem[]).map(async (ci) => {
      const product = await this.productService.getProduct(ci.productId);
      return {
        ...ci,
        product: product.value
      }
    }))
    return cart;
  }

  async createCart(user: any) {
    const cart = {
      isTemp: !!user?.isAnonymous,
      userId: user!.uid,
      createdAt: new Date(),
      updatedAt: null,
      status: 'Active',
    };

    return await this.db.addDocument(this.collection, cart).then((cart) => {
      this.cart = cart;
      return cart;
    });
  }

  async swapCartOwnership(newUserUid: string, cartId: string) {
    this.db.updateById(this.collection, cartId, { userId: newUserUid });
  }


}
