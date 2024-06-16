import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth/auth.service';
import { CartService } from './services/cart/cart.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'print-customs';
  user: firebase.default.User | null = null;

  constructor(
    private router: Router,
    private readonly auth: AuthService,
    private readonly cartService: CartService
  ) {}

  ngOnInit() {
    this.router.events.subscribe((event) => {
      window.scrollTo(0, 0);
    });

    this.auth.userObservable.subscribe(user => {
      this.user = user;
    })
  }

  logout() {
    this.auth.logout();
  }
}
