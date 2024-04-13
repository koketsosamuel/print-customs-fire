import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { catchError } from 'rxjs';
import { CartService } from '../cart/cart.service';
import { AlertService } from '../alert/alert.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: any = null;

  constructor(
    private readonly auth: AngularFireAuth,
    private readonly alertService: AlertService
  ) {
    auth.user.subscribe(user => {
      this.user = user || null;
    });
    
    auth.onAuthStateChanged(user => {
      this.user = user;
    })
  }

  anonymousLogin() {
    this.auth.user.subscribe(user => {
      if (!user) {
        this.auth.signInAnonymously();
      }
    });
  }

  getUserId() {
    return new Promise((resolve, reject) => {
      this.auth.user.pipe(catchError(err => {
        reject(err);
        return err;
      })).subscribe(user => {
        this.user = user || null;
        resolve(user);
      });
    })
  }

  registerUserWithEmailAndPassword(email: string, password: string) {
    return this.auth.createUserWithEmailAndPassword(email, password).then(res => {
      this.alertService.success('You are now registered and logged in');
      return res;
    }).catch(err => {
      this.alertService.success('Email or password is incorrect');
      return err;
    });
  }

  signInWithEmailAndPassword(email: string, password: string) {
    return this.auth.signInWithEmailAndPassword(email, password).then(res => {
      this.alertService.success('You are now logged in');
      return res;
    }).catch(err => {
      this.alertService.success('Email or password is incorrect');
      return err;
    });
  }

  resetPassword(email: string) {
    return this.auth.sendPasswordResetEmail(email).then(res => {
      this.alertService.success('Password reset email has been sent');
      return res;
    }).catch(err => {
      this.alertService.success('Email does not exist');
      return err;
    });
  }
}
