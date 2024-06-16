import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, catchError } from 'rxjs';
import { CartService } from '../cart/cart.service';
import { AlertService } from '../alert/alert.service';
import firebase from 'firebase/compat/app';
import { Router } from '@angular/router';
import { LoadingSpinnerService } from '../loading-spinner/loading-spinner.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user: firebase.User | null = null;
  userObservable: Observable<firebase.User | null>;

  constructor(
    private readonly auth: AngularFireAuth,
    private readonly alertService: AlertService,
    private readonly router: Router,
    private readonly loadingSpinner: LoadingSpinnerService
  ) {
    auth.user.subscribe((user) => {
      this.user = user || null;
    });

    this.userObservable = auth.user;

    auth.onAuthStateChanged((user) => {
      this.user = user;
    });
  }

  anonymousLogin() {
    return this.auth.signInAnonymously();
  }

  getUserId() {
    return new Promise((resolve, reject) => {
      this.auth.user
        .pipe(
          catchError((err) => {
            reject(err);
            return err;
          })
        )
        .subscribe((user: any) => {
          this.user = user || null;
          resolve(user);
        });
    });
  }

  registerUserWithEmailAndPassword(email: string, password: string) {
    let returnVal;
    this.loadingSpinner.show();
    try {
      if (this.user && this.user.isAnonymous) {
        const credential = firebase.auth.EmailAuthProvider.credential(
          email,
          password
        );
        returnVal = this.user
          .linkWithCredential(credential)
          .then((res) => {
            this.alertService.success('You are now registered and logged in');
          })
          .catch((err) => {
            if (err?.message.includes('auth/email-already-in-use')) {
              this.alertService.error(
                'The email address is already in use by another account.'
              );
            } else {
              this.alertService.error(
                'There was an error registering your account, please try again.'
              );
            }
            throw err;
          });
      } else {
        returnVal = this.auth
          .createUserWithEmailAndPassword(email, password)
          .then((res) => {
            this.alertService.success('You are now registered and logged in');
          })
          .catch((err) => {
            if (err?.message.includes('auth/email-already-in-use')) {
              this.alertService.error(
                'The email address is already in use by another account.'
              );
            } else {
              this.alertService.error(
                'There was an error registering your account, please try again.'
              );
            }
            throw err;
          });
      }
      return returnVal;
    } catch (err: any) {
      if (err?.message.includes('auth/email-already-in-use')) {
        this.alertService.error(
          'The email address is already in use by another account.'
        );
      } else {
        this.alertService.error(
          'There was an error registering your account, please try again.'
        );
      }
      throw err;
    } finally {
      this.loadingSpinner.hide();
    }

    return null;
  }

  signInWithEmailAndPassword(email: string, password: string) {
    return this.auth
      .signInWithEmailAndPassword(email, password)
      .then((res) => {
        this.alertService.success('You are now logged in');
        return res;
      })
      .catch((err) => {
        this.alertService.success('Email or password is incorrect');
        return err;
      });
  }

  resetPassword(email: string) {
    return this.auth
      .sendPasswordResetEmail(email)
      .then((res) => {
        this.alertService.success('Password reset email has been sent');
        return res;
      })
      .catch((err) => {
        this.alertService.success('Email does not exist');
        return err;
      });
  }

  logout() {
    this.loadingSpinner.show();
    this.auth
      .signOut()
      .then((res) => {
        this.router.navigate(['/']);
        this.alertService.success('You have been logged out!');
      })
      .catch((err) => {
        this.alertService.error('Something went wrong, please try again');
      })
      .finally(() => {
        this.loadingSpinner.hide();
      });
  }
}
