import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { first } from 'rxjs';
import { DbService } from '../db/db.service';
import { ICart } from 'src/app/models/cart.interface';
import { IPrintingInfo } from 'src/app/models/printing-info.interface';
import { StorageService } from '../storage/storage.service';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  collection = 'Cart' as const;
  cart!: ICart;

  constructor(
    private readonly auth: AuthService,
    private readonly db: DbService,
    private readonly storage: StorageService
  ) {}

  async getCart() {
    const user = this.auth.user;
    let cart: ICart | null = null;
    cart = await this._getCart(user.uid);

    if (!cart) {
      throw new Error('Cart not found.');
    }

    if (user && user?.uid) {
      if (!cart) {
        cart = {
          isTemp: !!user?.isAnonymous,
          userId: user!.uid,
          createdAt: new Date(),
          updatedAt: null,
          status: 'Active',
        };

        cart = await this.db.addDocument(this.collection, cart).then((cart) => {
          this.cart = cart;
          return cart;
        });
      }
      this.cart = cart as ICart;
    }
    return cart;
  }

  private async _getCart(userId: string) {
    const cart = await this.db
      .getDocumentWhereFieldEquals(this.collection, ['userId', userId]);
    this.cart = cart;
    return cart;
  }
}
