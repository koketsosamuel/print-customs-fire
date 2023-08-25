import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

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

}
