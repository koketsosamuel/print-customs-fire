import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: any = null;

  constructor(private readonly auth: AngularFireAuth) {
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
      console.log(user);
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

}
